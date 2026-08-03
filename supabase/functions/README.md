# Edge Functions — Caos Diário

Lógica sensível/privilegiada roda aqui (Deno + `service_role`), **nunca no
front** (ADR-001). Custo R$0: tier free do Supabase + Web Push nativo.

| Função | Papel | Gatilho | JWT |
|--------|-------|---------|-----|
| `publicar-quest-do-dia` | promove a quest do dia às 7h | cron (`x-cron-secret`) | `--no-verify-jwt` |
| `enviar-toque` | dispara 1 dos 4 toques de push | cron (`x-cron-secret`) | `--no-verify-jwt` |
| `fechar-o-dia` | virada: aplica falta + recarrega vidas | cron (`x-cron-secret`) | `--no-verify-jwt` |
| `processar-cumpri` | CUMPRI autoritativo: streak + carta | cliente (JWT do usuário) | verificado |
| `excluir-conta` | exclusão LGPD (cascade em auth.users) | cliente (JWT do usuário) | verificado |

`processar-cumpri` reusa o kernel puro testado (`src/lib/dominio`) via
`_shared/dominio.ts` — a regra de streak/raridade vive num lugar só.

## 1. Migrations

```bash
supabase db push   # aplica supabase/migrations/ (inclui push_subscriptions)
```

## 2. Gerar as chaves VAPID (uma vez)

```bash
npx web-push generate-vapid-keys
```

- A **pública** vai pro front como `VITE_VAPID_PUBLIC_KEY` (Vercel/`.env.local`).
- A **privada** é segredo do servidor (passo 3). Nunca versione nenhuma das duas.

## 3. Segredos do servidor (nunca no repo)

```bash
supabase secrets set \
  VAPID_PUBLIC_KEY=... \
  VAPID_PRIVATE_KEY=... \
  VAPID_SUBJECT=mailto:voce@dominio.com \
  CRON_SECRET=$(openssl rand -hex 32)
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` já existem no
ambiente das functions — não precisa setar.

## 4. Deploy

```bash
supabase functions deploy publicar-quest-do-dia --no-verify-jwt
supabase functions deploy enviar-toque          --no-verify-jwt
supabase functions deploy fechar-o-dia          --no-verify-jwt
supabase functions deploy processar-cumpri
supabase functions deploy excluir-conta
```

As de cron (`publicar-quest-do-dia`, `enviar-toque`, `fechar-o-dia`) usam
`--no-verify-jwt` porque se autenticam pelo `CRON_SECRET` (não há usuário).
`processar-cumpri` e `excluir-conta` mantêm a verificação de JWT (agem em nome
do usuário logado).

## 5. Agendamento (pg_cron + pg_net, no SQL editor)

Horários em **UTC** (São Paulo = UTC−3, sem horário de verão). 7h/12h/20h/22h SP
→ 10/15/23/01 UTC. Publica 5 min antes do toque da manhã.

```sql
-- extensões (grátis no Supabase)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- virada do dia: fecha o dia anterior 00:05 SP (03:05 UTC) — aplica falta + recarrega vidas
select cron.schedule('caos-fechar-dia', '5 3 * * *', $$
  select net.http_post(
    url    := 'https://<PROJECT_REF>.supabase.co/functions/v1/fechar-o-dia',
    headers:= jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>')
  );
$$);

-- publica a quest 06:55 SP (09:55 UTC)
select cron.schedule('caos-publicar', '55 9 * * *', $$
  select net.http_post(
    url    := 'https://<PROJECT_REF>.supabase.co/functions/v1/publicar-quest-do-dia',
    headers:= jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>')
  );
$$);

-- os 4 toques (manha 07h / meio-dia 12h / noite 20h / ultima 22h SP)
select cron.schedule('caos-toque-manha',    '0 10 * * *', $$select net.http_post(url:='https://<PROJECT_REF>.supabase.co/functions/v1/enviar-toque', headers:=jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'), body:=jsonb_build_object('toque','manha'));$$);
select cron.schedule('caos-toque-meiodia',  '0 15 * * *', $$select net.http_post(url:='https://<PROJECT_REF>.supabase.co/functions/v1/enviar-toque', headers:=jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'), body:=jsonb_build_object('toque','meio-dia'));$$);
select cron.schedule('caos-toque-noite',    '0 23 * * *', $$select net.http_post(url:='https://<PROJECT_REF>.supabase.co/functions/v1/enviar-toque', headers:=jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'), body:=jsonb_build_object('toque','noite'));$$);
select cron.schedule('caos-toque-ultima',   '0 1 * * *',  $$select net.http_post(url:='https://<PROJECT_REF>.supabase.co/functions/v1/enviar-toque', headers:=jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'), body:=jsonb_build_object('toque','ultima'));$$);
```

> Guarde o `CRON_SECRET` no Vault do Supabase e leia via `vault.decrypted_secrets`
> em vez de colar literal no cron, se quiser evitar o segredo em texto no schedule.

## Escala (projeção, não v1)

A **10k usuários** varrer inscrições em memória no `enviar-toque` é suficiente. A
**1M**, isto vira worker paginado / fila de envio — documentado em
`docs/…/escalabilidade.md`. Nada disso muda a v1.

## Ainda no servidor (próxima leva)

- **Ranking público** — view/RPC agregada (streak/fogo) SEM expor dado pessoal;
  decisão de produto pendente (o que aparece, opt-in) por ser LGPD-sensível.
- **Fogo do Caos** (`fires`, fase 2 / ADR-007): acender no CUMPRI e apagar na
  virada quando um dos dois falha — `processar-cumpri` e `fechar-o-dia` já deixam
  o ponto marcado.
- **Recuperação de outage** da virada: hoje o `fechar-o-dia` fecha um dia por
  execução; se o cron ficar >1 dia fora, o gap não é reconstruído (documentado).

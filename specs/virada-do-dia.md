# Spec — Virada do dia (`fechar-o-dia` Edge Function)

> Rodada 1 do loop. Passo 1 (planejar). Backlog v1: "Vidas (1/24h): absorve
> falha, sem carta no dia salvo" + "Edge Functions: ... fechar o dia". Sem ID
> formal no backlog (usa checkboxes) — o `/aprender` cataloga.

## 1. Escopo

Edge Function `fechar-o-dia` (Deno, `service_role`, cron), que ao fim de cada
"dia do caos" aplica a falta de quem **não cumpriu** a quest daquele dia —
**vida absorve** (streak sobrevive, sem carta) ou **streak zera** se não há vida
— e **recarrega** vidas (1/24h, capacidade 1 na v1), reusando as funções puras
testadas `processarDia(cumpriu=false)` e `recarregarVidas`. Idempotente por dia.

## 2. Fora de escopo

- **Recuperação de gap multi-dia** (queda do cron por >1 dia): esta rodada aplica
  só a transição do **último dia fechado**. Cron diário confiável ⇒ gap=1 é a
  norma; endurecer contra outage vira item futuro.
- **Capacidade > 1 / vidas extras** (`extras_comprados`): monetização fase 2
  (ADR-008). v1 é capacidade 1. `recarregarVidas` já cobre capacidade>1 quando chegar.
- **Fogo do Caos** (`fires`): fase 2 (ADR-007) — deixo o ponto marcado, não implemento.
- **Mudança de cliente/UI**: nenhuma. `lives.ts`/`streak.ts`/`tipos.ts`/telas ficam como estão.
- **Concessão de carta**: é do `processar-cumpri` (quem cumpriu). A virada nunca dá carta.
- **Batching para 1M**: a varredura em memória serve a 10k; 1M vira job paginado — só documental.

## 3. Origem e decisões que este item honra

- **ADR-005** (vidas 1/24h; vida absorve, sem carta; sem vida zera) — regra central.
- **ADR-002** (1 quest/dia; fuso SP) — o "dia fechado" é data-calendário em SP.
- **ADR-010** (single-tenant; isolamento por `auth.uid()`).
- `regras.md` §2 · `modelagem.md` ("streak recalculado na virada por Edge Function").
- Complementa `processar-cumpri` (rodada anterior), que só **soma** no CUMPRI.
- Reusa `src/lib/dominio` (mesmas funções dos 32 testes) — single source of truth (CLAUDE.md).

## 4. Arquivos afetados

- **novo** `supabase/functions/fechar-o-dia/index.ts` — a função.
- **edita** `supabase/functions/_shared/dominio.ts` — reexporta `recarregarVidas`
  (+ tipos `EstadoVidas`/`ResultadoRecarga`) de `vidas.ts` (sem imports internos → Deno OK).
- **novo** `supabase/migrations/20260802_streaks_rollover_ate.sql` — adiciona
  `streaks.rollover_ate date` (nullable) para idempotência; sem nova RLS (escrita é service_role).
- **edita** `supabase/schema.sql` — coluna `rollover_ate` em `streaks` + nota.
- **edita** `supabase/functions/README.md` — `fechar-o-dia` na tabela, deploy e cron (00:05 SP = 03:05 UTC).
- **edita** `docs/01_ARQUITETURA/escalabilidade.md` — nota do salto 10k→1M (varredura → job paginado).

Sem novo arquivo em `src/lib/dominio` (a composição das puras vive na função, como
no `processar-cumpri`) → não há função pura nova exigindo teste vitest novo.

## 5. Critérios de aceite

1. `fechar-o-dia` só executa com header `x-cron-secret` == `Deno.env.get('CRON_SECRET')`; senão **401**.
2. Nenhum segredo hardcoded — tudo via `Deno.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`).
3. Usa cliente `service_role` (a RLS proíbe o cliente de escrever `streaks`/`lives`); a chave nunca vai ao front.
4. `diaFechado` = data-calendário SP do dia que fechou, via `chaveDiaCaos(agora − 24h)` (mesmo idioma do `processar-cumpri`).
5. **Candidato à falta**: usuário com `streaks.atual > 0` **e** `ultima_data < diaFechado` **e** (`rollover_ate` nulo **ou** `< diaFechado`). Quem tem `ultima_data == diaFechado` (cumpriu) é ignorado.
6. **Falta-antes-de-recarga** (Passo A): a falta é decidida sobre a vida **atual** (sem recarregar antes), via `processarDia({streak, vidasAtuais}, false)`; grava `streaks.atual` novo (0 se zerou), `melhor` inalterado, `rollover_ate = diaFechado`. Uma vida NÃO recarrega a tempo de absorver a falta do mesmo dia — senão, com rollover diário, o streak nunca morreria (contra ADR-005). Vida absorvida → `lives` esvazia e inicia recarga de 24h; sem consumo, `lives` fica pro Passo B.
7. Regra ADR-005 respeitada nos 3 caminhos: cumpriu → ignorado; faltou com vida → `atual` intacto, vida consumida, **sem carta**; faltou sem vida (inclusive 2ª falta consecutiva) → `atual = 0`. A virada **nunca** concede carta nem sobe `melhor`.
8. **Recarga** (Passo B, quem tem vida pendente e não faltou; capacidade 1): `disponivel`/`recarrega_em` via `recarregarVidas`, com conversão `recarrega_em = âncora + 24h` (ou `null` se cheia) e `âncora = recarrega_em − 24h` na leitura. Quem faltou e zerou é recarregado aqui **depois** da decisão da falta.
9. Linha de `lives` ausente é tratada como **1 vida disponível** (paridade com `ESTADO_INICIAL` do `lives.ts`); a escrita usa upsert.
10. **Idempotente**: rodar 2× para o mesmo `diaFechado` não penaliza duas vezes (o gate `rollover_ate` barra a 2ª).
11. Nunca loga dado pessoal (id/e-mail/token); resposta JSON agregada `{ diaFechado, processados, faltas, zerados, recargas }`.
12. `select` com campos explícitos (`user_id, atual, melhor, ultima_data, rollover_ate` / `user_id, disponivel, recarrega_em`), nunca `select *`.
13. Custo R$ 0 (roda no tier free do Supabase; pg_cron/pg_net grátis).

## 6. Edge cases conhecidos

- **Sem candidatos** (ninguém faltou, nada a recarregar): retorna `processados: 0` sem erro.
- **Usuário sem linha em `streaks`** (nunca cumpriu): não é candidato — nada a perder.
- **`atual == 0`**: `processarDia` marca `streakZerou=false` — no-op, não regride.
- **2ª falta consecutiva zera** (ordem falta→recarga): a vida gasta na falta do dia D **não** volta a tempo de absorver a falta do dia D+1 — o streak morre, como o ADR-005 exige. A recarga só beneficia dias futuros.
- **Concorrência / reexecução**: gate `rollover_ate` + upsert idempotente.
- **Gap multi-dia (outage)**: aplica **uma** falta consolidada do último dia; sub-penaliza de propósito (documentado em Fora de escopo).
- **`CRON_SECRET` ausente no ambiente**: 401 (não roda "aberto").
- **10k linhas**: varredura + upserts em memória OK; **1M**: job paginado (documental).

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios de aceite em **sim**; `npm test` verde (32 testes, sem regressão);
`tsc` limpo e `npm run build` OK (a função Deno fica fora do tsconfig do app, mas o
shim reexporta `vidas.ts` sem quebrar nada no app); sem TODO pendente além do marcador
explícito de Fogo (fase 2); sem `console.log` de dado sensível; a regra ADR-005 conferida
nos três caminhos (cumpriu-ignora / falta-com-vida / falta-sem-vida).

---

## Resultado da review (rodada 1 — 2026-08-02)

**Aprovado sem ressalvas.** 13/13 critérios em sim; suíte verde.

Correção aplicada na review (1 rodada): a ordem **recarga→falta** (spec original,
critério 6) tornava o streak **imortal** com rollover diário — vida recarregava a
tempo de absorver a falta do dia seguinte, contra ADR-005. Invertido para
**falta-antes-de-recarga**; spec (critérios 6–8 + edge case) e código alinhados ao ADR.

Fica para próximas rodadas (fora de escopo cumprido): recuperação de outage
multi-dia; vidas extras (capacidade > 1, fase 2); apagar Fogo na virada (fase 2);
teste da composição da virada (hoje só as partes puras têm teste vitest — a
composição vive na função Deno, fora do alcance do vitest).

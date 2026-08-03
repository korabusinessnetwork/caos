# Plano de Segurança — Caos Diário

> Segurança e custo são parte da definição de pronto. Compliance: **LGPD**.
> Público inclui **menores (16+)** → cuidado redobrado. Ver `memory/restrictions.md`.
> Última atualização: 2026-07-24.

## 1. Modelo de ameaças (principais riscos)

| Risco | Vetor | Mitigação |
|---|---|---|
| Vazamento entre usuários | RLS mal configurada | RLS `auth.uid() = user_id` em toda tabela pessoal; testar por usuário |
| `service_role` exposto | chave no bundle do front | Só chave `anon` no cliente; `service_role` só em Edge Function |
| Escrita indevida (conceder carta / streak fake) | cliente chamando insert direto | Escrita privilegiada só via Edge Function; RLS bloqueia o resto |
| CUMPRI duplicado / carta dobrada | corrida / clique duplo | `UNIQUE (user_id, quest_id)` + botão idempotente |
| Dados de menores | coleta excessiva | Coletar o mínimo; consentimento claro; sem dado sensível |
| Link malicioso no `tiktok_url` | usuário cola URL arbitrária | Validar domínio TikTok; nunca renderizar como HTML; abrir com `rel=noopener` |
| Spam de push | envio não solicitado | Opt-in explícito; só 4 toques/dia; desativável |

## 2. RLS & isolamento (single-tenant — ADR-010)

- Isolamento é **por usuário** (`auth.uid()`), não por `tenant_id`.
- **Toda tabela** nasce com `enable row level security` na mesma migration.
- Tabelas pessoais (`completions`, `streaks`, `lives`, `user_cards`): policy `auth.uid() = user_id`.
- Tabelas de conteúdo (`quests` publicada, `cards`, `profiles`): SELECT público controlado; escrita só service_role.
- `fires`: SELECT só para os dois participantes.
- Teste de fundação: autenticar como usuário A e confirmar que não lê linhas de B.

## 3. Gestão de secrets

- Front: **apenas** `import.meta.env.VITE_*` (Vite só expõe esse prefixo).
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no cliente — nada além disso.
- `SUPABASE_SERVICE_ROLE_KEY` só no ambiente das Edge Functions / Vercel — **nunca** versionado, nunca no bundle.
- `.env` e `.env.local` no `.gitignore`; `.env.example` sem valores reais.

## 4. Compliance LGPD

- **Consentimento explícito** antes de coletar e-mail e ao habilitar push (opt-in).
- **Direito de exportar** (streak, cartas) e **excluir a conta** a qualquer momento (`src/lib/auth.ts → excluirConta`).
- Coleta mínima; sem dado sensível além do necessário.
- Menores (16+): linguagem clara, sem dark pattern, cancelamento tão fácil quanto adesão.
- Não guardamos vídeo (ADR-006) → não somos plataforma de conteúdo → sem dever de moderação de UGC de vídeo.

## 5. Validação de entrada

- Todo input validado na camada de serviço (`src/lib/`) antes do Supabase.
- `tiktok_url`: validar que é URL do TikTok; armazenar como texto; nunca interpolar em HTML.
- Mensagens de erro em português; sem vazar detalhe interno.

## 6. Logs & auditoria

- Log estruturado **sem** dado sensível (sem e-mail em claro, sem token).
- Eventos de jogo (`quest.cumprida`, `streak.quebrado`, `carta.ganha`) fire-and-forget.
- Falha de RLS ou tentativa de escrita privilegiada = evento a monitorar.

## 7. Checklist de segurança por release

- [ ] RLS habilitado e testado em toda tabela nova/alterada.
- [ ] Nenhum `service_role` no código do front (grep no bundle).
- [ ] Inputs validados; `tiktok_url` sanitizada.
- [ ] Sem log de dado sensível.
- [ ] Auth obrigatória antes de rota/ação protegida.
- [ ] Fluxos de consentimento e exclusão de conta funcionando.
- [ ] Custo do release mantido em tier gratuito.

## 8. Resposta a incidente (mínimo v1)

1. Conter (revogar chave / desabilitar função afetada).
2. Avaliar escopo (quais usuários / quais dados).
3. Notificar conforme LGPD se houver dado pessoal exposto.
4. Post-mortem em `memory/bugs.md` (causa raiz + ação preventiva + ADR se necessário).

## Ligações
- `memory/restrictions.md` — restrições legais e de custo.
- `docs/04_MODELAGEM` — políticas RLS por tabela.
- `CLAUDE.md` — regras de segurança da constituição do projeto.

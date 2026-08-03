# APIs & Serviços — Caos Diário

> Modelo: SPA (PWA) fala direto com Supabase via camada `src/lib/`. Sem API própria na v1.
> Escrita privilegiada roda em Edge Functions. Ver `docs/01_ARQUITETURA`.
> Última atualização: 2026-07-24.

## Camada de serviços (`src/lib/`)

**Regra dura:** nenhum componente chama `supabase.from(...)` direto. Todo acesso passa por um módulo de domínio. Contrato proposto (assinaturas — implementação é código, não vem antes do checklist):

### `src/lib/auth.ts`
- `login(email)` · `logout()` · `getSession()`
- `excluirConta()` — direito de exclusão (LGPD)

### `src/lib/quests.ts`
- `getQuestDoDia()` → lê `quests` com `status='publicada'` do dia
- `getArquivo()` → quests passadas
- `cumprir(questId, { tiktokUrl? })` → cria `completion` (idempotente), retorna carta

### `src/lib/streak.ts`
- `getStreak()` → `{ atual, melhor, ultimaData }`

### `src/lib/lives.ts`
- `getVida()` → `{ disponivel, recarregaEm }`

### `src/lib/cards.ts`
- `getAlbum()` → cartas do usuário + silhuetas faltantes

### `src/lib/push.ts`
- `inscrever()` · `desinscrever()` — Web Push via service worker

## Edge Functions (privilégio `service_role`)

| Função | Gatilho | O que faz |
|---|---|---|
| `publicar-quest-do-dia` | cron diário (antes das 7h) | marca a quest do dia como `publicada` |
| `disparar-push` | cron 7h/12h/20h/22h | envia os 4 toques via Web Push |
| `fechar-o-dia` | cron pós meia-noite (fuso BR) | recalcula streak, consome vida, recarrega vida |
| `conceder-carta` | após CUMPRI | valida e insere em `user_cards` (raridade/selo) |

> Por que Edge Function e não o cliente: essas operações precisam de `service_role`
> e/ou precisam ser a **única fonte** da verdade (ex: qual é a quest de hoje).
> `service_role` NUNCA vai para o front (só a chave `anon`).

## Convenção de erro (de `memory/patterns.md`)
- Mensagens de erro em português; código de erro estável (enum).
- Log estruturado sem dado sensível (sem e-mail em claro, sem token).
- Retry com backoff em 5xx; logs de jogo são fire-and-forget.

## Ligações
- `docs/04_MODELAGEM` — as tabelas por trás de cada serviço.
- `docs/11_SEGURANCA` — RLS e fronteira anon × service_role.
- `supabase/functions/` — onde as Edge Functions vivem.

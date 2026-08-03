# Ledger do Loop — Caos Diário

> Uma seção por rodada, mais recente no topo. O ciclo não reinicia sozinho.

## Rodada 1 — virada do dia (`fechar-o-dia`) — 2026-08-02
- **Spec:** `specs/virada-do-dia.md`
- **Resultado da review:** aprovado sem ressalvas (13/13; suíte verde). 1 correção na review:
  ordem `recarga→falta` (tornava o streak imortal) → `falta→recarga` (ADR-005; 2ª falta consecutiva zera).
- **Aprendido:** `memory/learnings.md` (imortalidade do streak por sincronia de relógios; limite do shim
  Deno a módulos-folha), `memory/patterns.md` (padrão "reuso de regra pura em Edge Function"),
  `docs/09_BACKLOG/backlog.md` (Vidas + 4 Edge Functions marcadas).
- **Commit:** ❌ **PENDENTE** — o projeto **não é um repositório git** (sem `.git`, sem remote). Não
  inicializei por conta própria (pasta sincronizada no OneDrive). Decisão do dono.
- **Pendente de decisão:**
  1. `git init` + remote (GitHub) para habilitar commit/push do ciclo.
  2. Ranking público — o que expor (apelido? opt-in?) por ser LGPD-sensível (público 16+).
- **Próximo item recomendado:** `payoff-cumpri` — surfacar `streak` + `carta` que o `processar-cumpri`
  já devolve, na tela do CUMPRI (pico emocional do loop; desbloqueado; verificável no browser).

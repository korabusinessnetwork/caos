# Ledger do Loop — Caos Diário

> Uma seção por rodada, mais recente no topo. O ciclo não reinicia sozinho.

## Rodada 3 — calendário real do streak (`calendario-real`) — 2026-08-02
- **Spec:** `specs/calendario-real.md`
- **Resultado da review:** aprovado sem ressalvas (9/9; suíte verde, `tsc` limpo, `vite build` OK).
  Sem correção na review. Verificado no browser (MODO_DEMO): tela Streak carrega, grade marca 21 dias,
  sem erro. Ramo real conferido por código (RLS `auth.uid()`, campos explícitos, dia via `partesEmSP`).
- **Aprendido:** `memory/learnings.md` (mês da consulta = mês local da grade; só o dia da célula em SP —
  alinhamento grade × marcações enquanto público é BR/UTC−3).
- **Commit:** _(preenchido após o commit)_ em `rodada-3-calendario-real`.
- **Pendente de decisão:**
  1. Ranking público — o que expor (apelido? opt-in?) por ser LGPD-sensível (público 16+).
- **Próximo item recomendado:** banco de 90 quests curadas (conteúdo do M0-lançamento) **ou** tela de
  Álbum ligada ao backup real de `user_cards` — ambos desbloqueiam venda/uso; conteúdo é do dono, Álbum é código.

## Rodada 2 — payoff do CUMPRI (`payoff-cumpri`) — 2026-08-02
- **Spec:** `specs/payoff-cumpri.md`
- **Resultado da review:** aprovado sem ressalvas (11/11; suíte verde, `tsc` limpo, `vite build` OK).
  Sem correção na review. Verificado no browser (MODO_DEMO): payoff com streak real (13), título
  "Agente do Caos", carta "O NARRADOR" raridade rara, selo PROVADO só com link, dispensar volta ao card.
- **Aprendido:** `memory/learnings.md` (nunca cravar resultado de recompensa em copy de UI — surfacar
  o `ResultadoCumpri` do servidor; `BotaoCumpri` neutralizado).
- **Commit:** ✅ `845dae2` em `rodada-2-payoff-cumpri` (push para `github.com/korabusinessnetwork/caos`).
- **Pendente de decisão:**
  1. Ranking público — o que expor (apelido? opt-in?) por ser LGPD-sensível (público 16+).
- **Próximo item recomendado:** persistir e surfacar `EstadoStreak`/`EstadoVidas` reais na tela Streak
  (hoje só demo) — fecha o outro lado do payoff (o estado que persiste entre dias), desbloqueado e verificável.

## Rodada 1 — virada do dia (`fechar-o-dia`) — 2026-08-02
- **Spec:** `specs/virada-do-dia.md`
- **Resultado da review:** aprovado sem ressalvas (13/13; suíte verde). 1 correção na review:
  ordem `recarga→falta` (tornava o streak imortal) → `falta→recarga` (ADR-005; 2ª falta consecutiva zera).
- **Aprendido:** `memory/learnings.md` (imortalidade do streak por sincronia de relógios; limite do shim
  Deno a módulos-folha), `memory/patterns.md` (padrão "reuso de regra pura em Edge Function"),
  `docs/09_BACKLOG/backlog.md` (Vidas + 4 Edge Functions marcadas).
- **Commit:** ✅ `801e024` em `main` (import inicial + rodada 1), push para
  `github.com/korabusinessnetwork/caos`. Próximas rodadas commitam em branch de trabalho.
- **Pendente de decisão:**
  1. Ranking público — o que expor (apelido? opt-in?) por ser LGPD-sensível (público 16+).
- **Próximo item recomendado:** `payoff-cumpri` — surfacar `streak` + `carta` que o `processar-cumpri`
  já devolve, na tela do CUMPRI (pico emocional do loop; desbloqueado; verificável no browser).

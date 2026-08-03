# Spec — Payoff do CUMPRI (`payoff-cumpri`)

> Rodada 2 do loop. Passo 1 (planejar). Item de UX do loop central (backlog v1:
> "CUMPRI ... → streak +1 → ganha a carta"). Sem ID formal — `/aprender` cataloga.

## 1. Escopo

No momento do CUMPRI em `QuestDoDia`, mostrar um **payoff celebratório** (`PayoffCumpri`)
com os dados **reais** do `ResultadoCumpri` que `marcarCumpri` já devolve — a carta
ganha (nome, raridade, selo PROVADO) e o streak atual — em vez do texto estático
"streak +1" de hoje. Funciona em `MODO_DEMO` (resultado fabricado) e no fluxo real.

## 2. Fora de escopo

- Backend/Edge Functions: **nada** (o `processar-cumpri` já devolve tudo).
- Física/animação elaborada de carta: uma reveal em CSS simples (<2s) basta.
- Som, haptics, confetti.
- Telas de Streak/Álbum: só o instante do CUMPRI.
- Registrar evento de payoff / analytics.
- Fogo do Caos (fase 2).

## 3. Origem e decisões que este item honra

- Loop central (`regras.md` §1: "marca CUMPRI → streak +1 → ganha a carta").
- `patterns.md` UI: "CUMPRI → animação da carta caindo → toast 'Dia {N} garantido'", feedback < 2s.
- Princípio nº1 (CLAUDE.md): emoção sobre informação; uma ação óbvia; estados sempre visíveis.
- ADR-006/008: selo PROVADO e watermark do card.
- Reusa `ResultadoCumpri`/`CartaGanha` (`src/lib/tipos.ts`) e `tituloPorStreak` (`dominio/streak.ts`, testado).
- Não catalogado no backlog como item isolado — `/aprender` registra.

## 4. Arquivos afetados

- **novo** `src/components/shared/PayoffCumpri.tsx` + `PayoffCumpri.css` — o overlay do payoff.
- **edita** `src/pages/QuestDoDia.tsx` — estado `payoff`, fabricação do resultado no demo, render do `PayoffCumpri`.
- **edita** `src/components/shared/BotaoCumpri.tsx` — remover a afirmação estática "carta no álbum. streak +1"; a fase `sucesso` fica neutra (o número real é do payoff).

Convenções: componente PascalCase em arquivo próprio, CSS separado, tokens `--caos-*`, identificadores de domínio em português.

## 5. Critérios de aceite

1. Ao marcar CUMPRI com sucesso, aparece `PayoffCumpri` com o **streak real** (`resultado.streak`), não o texto fixo "streak +1".
2. Se `resultado.ganhouCarta`, o payoff mostra a carta: **nome**, **raridade** (rótulo+forma+cor consistentes com `CardDoCaos`/design system) e selo **PROVADO** quando `resultado.provado`.
3. Se `ganhouCarta === false` (CUMPRI idempotente / já cumpriu), o payoff mostra **só o streak**, sem carta fantasma, sem quebrar.
4. Se `tituloPorStreak(resultado.streak)` != null, o título é exibido (reusa a função pura testada).
5. **MODO_DEMO**: `handleCumprir` fabrica um `ResultadoCumpri` local (streak base do demo +1; carta = título/raridade da quest demo; `provado` = tem link) e mostra o **mesmo** componente.
6. **Real**: usa o `ResultadoCumpri` devolvido por `marcarCumpri` — sem tocar backend.
7. Feedback aparece **< 2s** (animação CSS, sem espera artificial nova) e tem **uma** ação clara de dispensar (tap/"continuar"), dispensável por teclado (Esc/Enter).
8. `BotaoCumpri` não afirma mais estaticamente "carta no álbum. streak +1"; a fase de sucesso fica neutra.
9. CSS separado do JSX; só tokens `--caos-*`; **nenhuma cor hardcodada**; watermark/estética do card respeitada se reusar visual de carta.
10. Acessível: `role="dialog"` (ou `status`) com rótulo; foco/teclado tratados; contraste via tokens.
11. Sem regressão: selo no card e a `OfertaPush` seguem funcionando; `npm test` verde; `tsc` + `build` OK.

## 6. Edge cases conhecidos

- **`carta === null`** (idempotente): só streak, sem bloco de carta.
- **Erro no CUMPRI**: `marcarCumpri` lança → `BotaoCumpri` mostra erro, **sem** payoff (estado `payoff` não seta).
- **Streak cruza faixa de título** (3/7/30/90): mostra o novo título.
- **MODO_DEMO sem backend**: nada de rede; resultado 100% local.
- **Dispensar**: fechar o payoff mantém o card com o selo (`cumpri`/`provado`) e a `OfertaPush` (1º CUMPRI) segue seu fluxo.

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios em **sim**; `npm test` verde (sem regressão nas 32 puras); `tsc` limpo e
`vite build` OK; sem `console.log` nem TODO solto; verificado no browser (MODO_DEMO) que o payoff
aparece com streak real e a carta correta, e que dispensar volta ao card com o selo.

---

## Resultado da review (rodada 2 — 2026-08-02)

**Aprovado sem ressalvas.** 11/11 critérios em sim; suíte verde (32 testes), `tsc` limpo, `vite build` OK.
Sem correção necessária na review. Verificado no browser (MODO_DEMO):

- Payoff mostra `streak` real **13** (12+1), não "streak +1"; chamada "dia 47 garantido".
- `tituloPorStreak(13)` → "Agente do Caos" exibido (função pura reusada).
- Carta "O NARRADOR" raridade `rara` (classe `payoff__carta--rara`, mesmo padrão do `CardDoCaos`); watermark "CAOS" presente.
- Selo **PROVADO** aparece só com link do TikTok colado; sem link, só streak+carta.
- `BotaoCumpri` fase sucesso agora neutra ("o caos registrou."); a afirmação estática "carta no álbum. streak +1" foi removida.
- Dispensar ("continuar"/tap/Esc/Enter) fecha o overlay e mantém o card com o selo.

Fica para próximas rodadas: variante `ganhouCarta === false` (idempotente) só é exercitável no fluxo real
(o demo sempre fabrica carta) — o código a cobre por guarda `carta && meta`, mas sem teste de UI automatizado.

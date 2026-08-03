# ADR-002 — Uma quest sincronizada por dia (7h nacional)

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

O núcleo do produto é o **evento coletivo**: o Brasil inteiro fazendo a mesma coisa no
mesmo dia, concentrando a hashtag e virando feed de comparação. A frequência das quests
afeta diretamente essa concentração e a viabilidade de execução física e de curadoria.

## Decisão

**Uma (1) quest por dia, sincronizada nacionalmente, revelada às 7h.** Não é 1 a cada 4h,
não são várias por dia. Todos recebem a MESMA quest no MESMO dia com a hashtag `#CaosDia{N}`.

## Alternativas Consideradas

- **Várias quests/dia (ex: 1 a cada 4h):** prós = mais engajamento aparente; contras =
  **dilui a hashtag** (mata o efeito de feed concentrado), inviabiliza execução física
  (não dá pra cumprir 6 desafios reais/dia) e **sextuplica a curadoria**. Descartado.
- **Quest sob demanda / personalizada por usuário:** destrói o sync — sem evento coletivo,
  vira app de tarefa solitário. Descartado.

## Consequências

- **Positivas:** hashtag concentrada = viral; curadoria sustentável (1/dia); ritual claro.
- **Trade-offs:** um "miss" de qualidade num dia afeta todo mundo — daí a curadoria
  humana rigorosa (ADR-004) e a métrica "% que cumpre" como sinal de quest errada.

## Referências
- CAOS_FUNDACAO.md §2, §13
- `docs/03_REGRAS_DE_NEGOCIO/regras.md`

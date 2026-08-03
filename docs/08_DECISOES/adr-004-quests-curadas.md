# ADR-004 — Quests curadas por humanos, nunca geradas por IA em runtime

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus, Guilherme, Macedo (curadoria)
**Supersede**: —
**Supersedido por**: —

---

## Contexto

A quest é o produto e é lida por milhões no mesmo dia. Um enunciado ruim, perigoso ou
ilegal afeta todo mundo de uma vez. Gerar quests por IA em tempo real traria custo de API,
imprevisibilidade e risco de segurança/legal.

## Decisão

**Quests são curadas por humanos** (Matheus + Guilherme + Macedo), escritas com antecedência
(meta: banco de 90 quests antes do lançamento). **Nunca** geradas por IA em runtime. Um LLM
pode ajudar a *rascunhar* na curadoria, mas a aprovação é sempre humana (ver `docs/10_PROMPTS`).

## Alternativas Consideradas

- **Geração por IA em runtime:** prós = variedade infinita; contras = custo de API recorrente
  (contra o alvo R$ 0), qualidade instável, e **risco legal/segurança** (quest perigosa/ilegal
  publicada automaticamente pra milhões). Descartado.
- **Quests enviadas pela comunidade (UGC):** exige moderação em escala; adiado para o futuro,
  não v1.

## Consequências

- **Positivas:** custo zero de API, qualidade e segurança controladas, tom consistente.
- **Trade-offs:** curadoria é trabalho humano contínuo (o único "custo real" da v1 — tempo criativo).
  Mitigado pelo ritmo de 1/dia (ADR-002) e produção em lote.

## Referências
- CAOS_FUNDACAO.md §6, §8
- `docs/10_PROMPTS/prompts.md` · `memory/patterns.md` (padrão OBRIGATÓRIO de escrita)

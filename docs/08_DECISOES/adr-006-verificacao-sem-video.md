# ADR-006 — Verificação: honor system + link opcional; ZERO infra de vídeo

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

O produto gera vídeo, mas hospedar vídeo próprio traria custo de infra explosivo, dever de
moderação legal insustentável, e **canibalizaria o post no TikTok** — que é o nosso canal de
aquisição (CAC zero). Precisamos "verificar" o cumprimento sem hospedar nada.

## Decisão

**Nunca hospedar vídeo próprio, nunca live, nunca feed interno.** Verificação em 3 camadas,
custo ~zero:
1. **Honor system** — CUMPRI vale por si (streak + carta comum).
2. **Prova leve** — colar o link do TikTok (opcional) → carta com selo **PROVADO**; guardamos
   **só a URL** (o incentivo aponta pro post público = aquisição).
3. **Contestação social (fase 2)** — parceiro de fogo tem botão "duvido"; contestado precisa do
   link pra manter o dia. Rankings oficiais contam só dias provados.

## Alternativas Consideradas

- **Upload/hospedagem de vídeo no app:** custo de storage/CDN/transcode, moderação legal de
  UGC, e concorrência direta com o TikTok. Descartado (é o oposto da estratégia).
- **Verificação automática (visão computacional):** custo e complexidade altíssimos, frágil.
  Descartado.

## Consequências

- **Positivas:** custo ~zero; sem dever de moderação de vídeo; cada prova é um post público
  que traz gente nova. Benchmark: Duolingo/BeReal/Snapchat não verificam e funcionam.
- **Trade-offs:** dá pra "trapacear" no honor system — aceito de propósito: quem trapaceia um
  jogo cujo prêmio é a diversão sai sozinho. A contestação social (fase 2) cobre rankings.

## Referências
- CAOS_FUNDACAO.md §5
- `docs/03_REGRAS_DE_NEGOCIO/regras.md` §5 · `memory/restrictions.md` (ZERO infra de vídeo)

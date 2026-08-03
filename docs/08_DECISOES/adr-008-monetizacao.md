# ADR-008 — Monetização: proteção/status/extra; loop grátis pra sempre

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

O crescimento depende do viral, e o viral depende de o usuário grátis postar. Qualquer
monetização que atrite o loop básico ou o card mata a máquina de aquisição.

## Decisão

**O loop principal é grátis pra sempre.** Cobra-se proteção, status e extra — nunca o caos.

| Camada | Item | Preço |
|---|---|---|
| 1 | Vida extra (freeze) | R$ 4,90 |
| 1 | Freeze de Fogo | R$ 6,90 |
| 2 | **CAOS+** (2 vidas/mês, Modo Insano, cartas foil, molduras/títulos, stats) | R$ 9,90/mês · R$ 79/ano |
| 3 | Passe de Temporada (cosmético; destrava cumprindo) | R$ 14,90/90d |
| 3 | Repescagem anual | R$ 9,90/evento |
| 3 | Carta física (só lendárias) | R$ 19,90 + frete |
| 4 | Quest patrocinada (máx 1/semana, só 50k+ MAU) | negociado |

**CAOS+ NUNCA inclui:** ver a quest antes das 7h · carta sem cumprir · remover a marca do card.
**NUNCA fazer:** banner/interstitial · pay-to-win na coleção · paywall no loop básico.

## Alternativas Consideradas

- **Anúncios (banner/interstitial):** rendem pouco e degradam a experiência e a estética do
  card. Descartado explicitamente.
- **Paywall no loop / vender cartas sem cumprir (pay-to-win):** quebraria a integridade do jogo
  e a máquina viral. Descartado explicitamente.

## Consequências

- **Positivas:** o grátis segue sendo marketing; monetiza emoção (proteção às 22h) e status,
  sem tocar no que traz gente nova. **Watermark nunca à venda.**
- **Trade-offs:** receita depende de escala/viral (âncora: 10k MAU ≈ R$ 4–5k/mês). Gateway de
  pagamento é custo → **adiado para a fase 2** (só quando existirem streaks > 14d). Sem gateway na v1.

## Referências
- CAOS_FUNDACAO.md §7, §10
- `memory/restrictions.md` (loop grátis, sem dark patterns) · `docs/03_REGRAS_DE_NEGOCIO/regras.md` §7

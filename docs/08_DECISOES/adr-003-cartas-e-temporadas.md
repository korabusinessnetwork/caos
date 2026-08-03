# ADR-003 — Cartas do Caos colecionáveis + temporadas de 90 dias

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

Streak sozinho tem um problema: quando quebra, o usuário perde o motivo de voltar. Precisamos
de um segundo eixo de retenção que sobreviva à quebra do streak e dê recompensa tangível
por cada dia cumprido.

## Decisão

Cada quest cumprida concede **1 carta única** daquela quest, com raridades (Comum · Rara ·
Lendária · Secreta) e **temporadas de 90 dias** (visual novo por temporada). Carta perdida =
quest perdida (repescagem paga 1×/ano). Selo **PROVADO** para quem cola o link (ver ADR-006).

## Alternativas Consideradas

- **Só pontos/XP:** abstrato, não colecionável, sem FOMO. Descartado.
- **Cartas sem temporada:** coleção "infinita" perde senso de urgência e de recomeço.
  Temporadas de 90d criam ciclos e um alvo de "completar". Escolhido.

## Consequências

- **Positivas:** retenção de longo prazo mesmo após quebra de streak; FOMO por carta perdida;
  o álbum é motivo pra voltar; sinergia futura com cartas físicas (v3).
- **Trade-offs:** exige arte por quest (curadoria/design). Mitigado por estilo consistente
  (Atmosfera Viral) e produção em lote.

## Referências
- CAOS_FUNDACAO.md §4.2, §10
- `docs/03_REGRAS_DE_NEGOCIO/regras.md` §3 · `docs/04_MODELAGEM`

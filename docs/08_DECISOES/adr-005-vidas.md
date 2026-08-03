# ADR-005 — Sistema de vidas (1 a cada 24h) em vez de freeze mensal

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

Streak com perda real é motor de retenção, mas perda brusca (zerar por um dia ruim) afasta.
Precisamos de uma rede de proteção que seja **dramática e clara**, sem virar "streak que nunca
morre" (o que mataria a tensão).

## Decisão

**1 vida a cada 24h.** Ao falhar, a vida absorve: o streak sobrevive, **mas o usuário não
ganha a carta** daquele dia. Falhar de novo no ciclo **sem vida** → streak zera. Vida extra
é comprável (streak freeze pago) — monetização de proteção (ADR-008), não v1.

## Alternativas Consideradas

- **Freeze mensal (estilo Duolingo):** menos dramático, decisão rara, monetiza pior. A vida
  diária cria uma micro-decisão emocional todo dia (o push das 22h). Escolhido.
- **Sem proteção nenhuma:** perda brusca demais; churn no primeiro tropeço. Descartado.

## Consequências

- **Positivas:** tensão diária preservada; a perda da carta (mesmo com streak salvo) mantém
  o custo do erro; gancho de monetização emocional (vida extra às 22h).
- **Trade-offs:** regra a comunicar bem na UI (streak salvo ≠ carta ganha) — cuidar da
  intuitividade pra não confundir.

## Referências
- CAOS_FUNDACAO.md §4.1, §7
- `docs/03_REGRAS_DE_NEGOCIO/regras.md` §2 · `docs/04_MODELAGEM` (tabela `lives`)

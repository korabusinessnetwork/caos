# ADR-007 — Fogo do Caos (streak em dupla)

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

Disciplina individual tem teto de retenção. A pressão social (não deixar o amigo na mão) é
um motor mais forte e transfere parte da retenção para os próprios usuários.

## Decisão

**Fogo do Caos:** streak compartilhado entre dois usuários. O fogo fica aceso se **ambos**
cumprirem no mesmo dia; se um falha, apaga para os dois. Adiciona-se por código/link (o
convite é canal de aquisição). Marcos: 7d normal → 30d azul → 90d branco 亡者. Máx. **5 fogos
simultâneos** na v1. O push das 20h faz um cobrar o outro.

## Alternativas Consideradas

- **Só streak individual:** simples, mas retenção menor. Fogo adiciona pressão social sem
  substituir o individual. Escolhido como complemento.
- **Grupos grandes desde a v1 (squad):** coordenação difícil, mais complexo. Adiado para v3
  (Parking Lot). Dupla primeiro.

## Consequências

- **Positivas:** aposta de ser o **maior preditor de D30**; retenção terceirizada (usuários
  cobram uns aos outros); link de convite gera aquisição.
- **Trade-offs:** "apaga dos dois" pode gerar frustração — mitigado por Freeze de Fogo pago
  (ADR-008) e pelo limite de 5 fogos pra não pulverizar a atenção.

## Referências
- CAOS_FUNDACAO.md §4.3, §13
- `docs/03_REGRAS_DE_NEGOCIO/regras.md` §4 · `docs/04_MODELAGEM` (tabela `fires`)

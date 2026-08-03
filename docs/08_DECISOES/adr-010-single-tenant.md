# ADR-010 — Single-tenant B2C: exceção consciente ao padrão white-label

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

O padrão de fundação da Kova/Kora prega **multi-tenant white-label desde a linha 1** (nada de
marca/cor/regra hardcodada; identidade vem do tenant). O Caos Diário, porém, é um **produto B2C
único**: uma marca só ("Caos"), um público, sem clientes-empresa e sem revenda de marca branca.
Aplicar multi-tenancy aqui seria complexidade e custo sem nenhum comprador.

## Decisão

**Registrar exceção consciente ao padrão.** O Caos Diário nasce **single-tenant**:
- **Sem `tenant_id`** nas tabelas.
- **Sem white-label** — a marca "Caos" é fixa e faz parte do produto (o watermark, inclusive, é
  inegociável — ADR-008).
- **Isolamento por usuário** via RLS (`auth.uid() = user_id`), não por tenant.

Esta é a única quebra deliberada do padrão de fundação, e é intencional.

## Alternativas Consideradas

- **Multi-tenant desde já (seguir o padrão):** prós = "pronto pra white-label"; contras =
  `tenant_id` em tudo, políticas RLS mais complexas, modelagem e UI carregando um conceito sem
  usuário real. **Descartado** — YAGNI para um B2C de marca única.
- **Single agora, multi no roadmap:** manteríamos ganchos pra multi-tenant. Descartado: não há
  hipótese de negócio que peça white-label; adicionar depois (se algum dia) é um ADR novo.

## Consequências

- **Positivas:** schema e RLS mais simples e seguros; foco total no produto; menos superfície de erro.
- **Trade-offs / risco monitorado:** se algum dia surgir demanda de white-label (ex: versão de
  marca para um parceiro), será preciso reintroduzir tenancy — o que exigirá migração de schema
  e políticas. Aceito conscientemente. A reversão desta decisão se dá por **novo ADR que supersede
  este**.

## Referências
- CAOS_FUNDACAO.md §"COMO USAR" item 4 (multi-tenant NÃO na v1)
- `references/multi-tenant-white-label.md` (o padrão do qual isto é exceção)
- `memory/restrictions.md` (exceção aprovada) · `docs/04_MODELAGEM` · `docs/11_SEGURANCA`

# 08 — DECISÕES · Caos Diário

> ADRs (Architecture Decision Records): por que escolhemos X em vez de Y.

## O que vive aqui

- **ADRs**: decisões técnicas formalizadas (status, contexto, alternativas, consequências)
- **Ciclo de vida**: Proposto → Aceito → Supersedido
- **Arquivo**: um ADR por arquivo (`adr-NNN-titulo.md`)
- **Histórico**: decisões antigas/supersedidas ficam, marcadas como "Supersedido por"
- **Rastreabilidade**: quando foi decidido, quem decidiu, qual código implementa

## O que NÃO vive aqui

- Implementação da decisão → `src/`
- Especificações de API → `07_APIS/`
- Regras de negócio → `03_REGRAS_DE_NEGOCIO/`
- Fluxos → `05_FLUXOS/`

## Índice de ADRs (fundação — todos Aceitos em 2026-07-24)

| ID | Título | Arquivo |
|---|---|---|
| ADR-001 | Stack: React + TS + Vite (PWA) · Supabase · Vercel · Web Push | [adr-001-stack.md](adr-001-stack.md) |
| ADR-002 | Uma quest sincronizada por dia (7h nacional) | [adr-002-uma-quest-por-dia.md](adr-002-uma-quest-por-dia.md) |
| ADR-003 | Cartas do Caos + temporadas de 90 dias | [adr-003-cartas-e-temporadas.md](adr-003-cartas-e-temporadas.md) |
| ADR-004 | Quests curadas por humanos, nunca IA em runtime | [adr-004-quests-curadas.md](adr-004-quests-curadas.md) |
| ADR-005 | Vidas (1/24h) em vez de freeze mensal | [adr-005-vidas.md](adr-005-vidas.md) |
| ADR-006 | Verificação honor + link; ZERO infra de vídeo | [adr-006-verificacao-sem-video.md](adr-006-verificacao-sem-video.md) |
| ADR-007 | Fogo do Caos (streak em dupla) | [adr-007-fogo-do-caos.md](adr-007-fogo-do-caos.md) |
| ADR-008 | Monetização: loop grátis + CAOS+; sem dark patterns | [adr-008-monetizacao.md](adr-008-monetizacao.md) |
| ADR-009 | Nome e marca "Caos Diário" / família "Caos" | [adr-009-nome-e-marca.md](adr-009-nome-e-marca.md) |
| ADR-010 | Single-tenant B2C — exceção consciente ao white-label | [adr-010-single-tenant.md](adr-010-single-tenant.md) |

> Índice espelhado em `memory/decisions.md`. Template para novos ADRs: [adr-000-template.md](adr-000-template.md).

## Como preencher

1. **Copie `adr-000-template.md`**: renomeie para `adr-NNN-titulo.md`
2. **Preencha todas as seções**: Contexto, Decisão, Alternativas, Consequências
3. **Status começa "Proposto"**: aprovação → "Aceito", depois → "Supersedido"
4. **Não delete ADRs antigos**: marque como "Supersedido por adr-NNN", arquivo fica no histórico
5. **Atualize quando decisão muda**: novo ADR que supersede, link bidirecional

## Ligações

- `adr-000-template.md` — comece aqui, clone para novo ADR
- `01_ARQUITETURA/` — ADRs justificam as escolhas técnicas
- `03_REGRAS_DE_NEGOCIO/` — se regra é decisão técnica, document em ADR

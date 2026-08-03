# Decisões de Arquitetura — Caos Diário

## Objetivo
- Registrar todas as decisões arquiteturais e de produto relevantes
- Evitar re-discussão de problemas já resolvidos
- Documentar trade-offs e contexto de cada decisão

## Contexto
- Sistema vive em `/docs/08_DECISOES/` (ADRs em markdown)
- Cada ADR tem ID sequencial (ADR-001, ADR-002, etc.)
- ADRs são imutáveis após mergeados (novos ADRs superseden os antigos)

## Regras Gerais
- Toda decisão de arquitetura, tech stack ou produto vai para um ADR
- Decisão = mudança que afeta 2+ componentes ou ciclo de vida longo
- Pequenos bugs/refators não viram ADR
- ADR sobrescreve docs divergentes; ADR é fonte de verdade

## Validações
- ADR tem contexto claro (problema, alternativas, consequências)?
- Decisão foi discutida com stakeholders chave?

## Permissões
- Qualquer dev pode propor ADR (em `docs/08_DECISOES/ADR-XXX-titulo.md`)
- Dono/tech lead: aprova merge

## Exceções
- ADR de máxima urgência (segurança, compliance): pode ser escrito pós-deploy com tag [URGENT]

## Auditoria
- Revisar ADRs semestralmente vs. realidade da codebase

## Eventos
- `decision.proposed`, `decision.superseded`, `decision.reviewed`

## Configurações Futuras
- Bot para validar formato de ADR
- Acoplamento automático ADR ↔ issues/PRs

## Casos de Uso
- "Por que escolhemos Supabase e não Firebase?"
- "O que mudou de banco de dados e quando?"
- "Quem decidiu usar Context API e não Redux?"

## Critérios de Aceite
- [ ] Índice abaixo está em sync com arquivos em docs/08_DECISOES/
- [ ] Cada ADR tem Status e Data de revisão
- [ ] ADRs obsoletos têm link para sucessor

---

## O que é um ADR?

Architecture Decision Record (ADR) é um documento que captura uma escolha arquitetural significativa, as alternativas consideradas, e as consequências. Formato padrão (Michael Nygard):

- **Status**: Proposed / Accepted / Superseded / Rejected / Deprecated
- **Contexto**: Por que estamos fazendo isso? Qual problema?
- **Decisão**: O que decidimos?
- **Alternativas consideradas**: O que mais pensamos?
- **Consequências**: O que muda? Tradeoffs?

## Índice de ADRs

| ID | Título | Status | Data | Supersede/Supersedido por |
|---|---|---|---|---|
| ADR-001 | Stack Inicial: React + TS + Vite (PWA) · Supabase · Vercel · Web Push | Accepted | 2026-07-24 | — |
| ADR-002 | Uma quest sincronizada por dia (7h nacional) | Accepted | 2026-07-24 | — |
| ADR-003 | Cartas do Caos + temporadas de 90 dias | Accepted | 2026-07-24 | — |
| ADR-004 | Quests curadas por humanos, nunca IA em runtime | Accepted | 2026-07-24 | — |
| ADR-005 | Vidas: 1 a cada 24h; streak protegido por vida | Accepted | 2026-07-24 | — |
| ADR-006 | Verificação por honra + link opcional; ZERO infra de vídeo | Accepted | 2026-07-24 | — |
| ADR-007 | Fogo do Caos (streaks em dupla) | Accepted | 2026-07-24 | — |
| ADR-008 | Monetização: loop grátis + CAOS+; sem dark patterns | Accepted | 2026-07-24 | — |
| ADR-009 | Nome e marca "Caos" (família coesa) | Accepted | 2026-07-24 | — |
| ADR-010 | Single-tenant B2C — exceção consciente ao padrão white-label | Accepted | 2026-07-24 | — |

## Regra Principal

> Toda decisão de arquitetura/produto relevante que afeta 2+ sistemas ou tem ciclo de vida > 1 sprint vira um ADR. Sem exceção.

Propostas de ADR vão em `docs/08_DECISOES/` como `ADR-NNN-titulo-da-decisao.md`. Numeração é sequencial, única, e nunca reciclada.

## Template para novo ADR

```markdown
# ADR-NNN: {{TITULO}}

## Status
Proposed / Accepted / Rejected

## Contexto
[Qual o problema? Que restrições existem? Por que decidir agora?]

## Decisão
[O que decidimos, em uma frase clara.]

## Alternativas Consideradas
- [Alternativa 1]: prós, contras
- [Alternativa 2]: prós, contras

## Consequências
- [Impacto positivo]
- [Trade-off aceito]
- [Risco a monitorar]

## Referências
- [Link p/ doc/discussão]
- [Link p/ implementação]
```

## Como Contribuir

1. Propor ADR em `docs/08_DECISOES/ADR-XXX-titulo.md`
2. Solicitar revisão ao tech lead / dono
3. Discutir alternativas (no PR)
4. Merge quando consenso atingido
5. Atualizar índice acima

## Decisões Supersedidas / Em Review

- Supersedidas: (nenhuma — todos os ADRs 001–010 estão Accepted)
- Em revisão / pautas futuras: gateway de pagamento (fase 2, ADR-008 §fase 2) · ranking oficial de dias provados · Modo Insano

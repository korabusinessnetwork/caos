# Registro de Bugs Conhecidos — Caos Diário

## Objetivo
- Documentar bugs conhecidos em produção
- Evitar re-report de problemas já conhecidos
- Rastrear status e ETA de correções
- Post-mortems de bugs críticos

## Contexto
- Bugs em código (não user error) vão aqui
- Separados por severidade: CRÍTICA / ALTA / MÉDIA / BAIXA
- Estados: aberto / em_analise / em_correcao / corrigido / reaberto / wontfix

## Regras Gerais
- Apenas bugs que afetam produção (não dev)
- Toda bug CRÍTICA/ALTA vira ADR se deixar débito técnico
- Reaberturas ganham tag [REABERTO] com data nova

## Validações
- Bug tem repro steps claros?
- Impacto no usuário está quantificado?

## Permissões
- Dev: abre/atualiza status
- Tech lead (Matheus): aprova "wontfix" ou prioriza

## Exceções
- Bug crítico (segurança, perda de dados): correção > documentação

## Auditoria
- Triagem semanal de bugs abertos
- Bug "em_analise" > 7 dias = escalar

## Eventos
- `bug.reported`, `bug.reproduced`, `bug.fixed`, `bug.reopened`

## Casos de Uso
- "O streak zerou sozinho? Já sabemos?"
- "A carta não caiu depois do CUMPRI — é bug conhecido?"
- "Qual o status do bug do push das 7h?"

## Critérios de Aceite
- [ ] Bugs > 30 dias abertos revisados
- [ ] Bugs corrigidos têm referência a PR
- [ ] Bug crítico tem post-mortem

---

> **Projeto em fundação (2026-07-24).** Sem produção → sem bugs registrados.
> As tabelas abaixo nascem vazias. A estrutura (severidade, estados, template,
> SLA) já está pronta para o primeiro bug real.

## Registro por Severidade

### CRÍTICA (perda de dados, segurança, quebra do loop)

| ID | Data | Módulo | Descrição | Status | Correção/ADR | ETA |
|---|---|---|---|---|---|---|
| _(nenhum)_ | | | | | | |

**Critério de fechamento**: merge de PR + deploy produção + validação

### ALTA (impacto operacional, muitos usuários, há workaround)

| ID | Data | Módulo | Descrição | Status | Correção/ADR | ETA |
|---|---|---|---|---|---|---|
| _(nenhum)_ | | | | | | |

### MÉDIA (impacto limitado ou raro)

| ID | Data | Módulo | Descrição | Status | Correção/ADR | ETA |
|---|---|---|---|---|---|---|
| _(nenhum)_ | | | | | | |

### BAIXA (cosmético, cenário de nicho)

| ID | Data | Módulo | Descrição | Status | Correção/ADR | ETA |
|---|---|---|---|---|---|---|
| _(nenhum)_ | | | | | | |

---

## Áreas de Risco a Vigiar (pré-produção, não são bugs)

> Onde bug provavelmente vai aparecer primeiro, dado o design do produto.

- **Push das 7h**: entrega sincronizada em massa via Web Push — atraso/duplicidade quebra o "evento nacional".
- **Fuso e virada de dia**: cálculo de streak/vida na virada da meia-noite (timezone Brasil).
- **Idempotência do CUMPRI**: clicar 2x não pode dar 2 cartas nem 2 completions.
- **RLS**: falha de política = vazamento entre usuários (tratar como CRÍTICA imediata).

---

## Estados
- **aberto**: reportado, não confirmado
- **em_analise**: dev investigando
- **em_correcao**: PR aberto, em review
- **corrigido**: merge em main, aguardando deploy
- **reaberto**: causa raiz não resolvida (tag [REABERTO] + data)
- **wontfix**: descartado, motivo documentado

## Template para Reportar

```markdown
## Bug Report: [título]

**Severidade**: CRÍTICA / ALTA / MÉDIA / BAIXA
**Módulo**: [quest / streak / cartas / vidas / push / auth]

**Descrição**: o que acontece / o que deveria acontecer

**Repro Steps**:
1. ...
2. ...

**Impacto**: quantos usuários / qual parte do loop está bloqueada

**Contexto**: navegador · SO · data/hora · é PWA instalado?

**Logs**: (estruturados, sem dado sensível)

**Workaround** (se existe): ...
```

## Bugs Corrigidos (últimos 30 dias)

| ID | Data Fechamento | Módulo | Referência |
|---|---|---|---|
| _(nenhum)_ | | | |

## Post-Mortems (Bugs Críticos)

| Bug | Data | Causa Raiz | Ação Preventiva | ADR |
|---|---|---|---|---|
| _(nenhum)_ | | | | |

---

## SLA de Resposta
- **CRÍTICA**: 1h análise, 4h correção
- **ALTA**: 1 dia análise, 2 dias correção
- **MÉDIA**: 1 semana
- **BAIXA**: backlog (sem ETA)

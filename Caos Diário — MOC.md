---
aliases: [Caos Diário, Caos MOC, Caos — Mapa]
tags: [moc, projeto/caos, fundacao]
status: fundação-validada
atualizado: 2026-07-24
---

# 🌀 Caos Diário — MOC

> Mapa de conteúdo (hub de navegação no Obsidian) da fundação do **Caos Diário**.
> Todo dia às 7h, o Brasil inteiro recebe a **mesma** quest absurda → cumpre →
> filma → posta no TikTok. O app é a camada de jogo; o vídeo é o marketing.

**Status:** fundação validada ✅ — nenhuma linha de código de aplicação ainda
(regra do documento-mestre). Próximo passo é a fase de código via [[Caos/INSTALACAO|INSTALACAO.md]].

---

## 🏛️ Constituição & entrada

- [[Caos/CLAUDE|CLAUDE.md]] — constituição do projeto (fonte de verdade)
- [[Caos/README|README.md]] — porta de entrada do repositório
- [[Caos/INSTALACAO|INSTALACAO.md]] — setup do ambiente (fase de código)
- [[Caos/CAOS_FUNDACAO|CAOS_FUNDACAO.md]] — documento-mestre de fundação (intake original)
- [[Caos/respostas-intake|respostas-intake.md]] — respostas do intake

## 🧠 Memória (governança viva)

- [[Caos/memory/identity|identity]] — visão, personas (Bia · Léo · Duda), tom de voz, roadmap
- [[Caos/memory/decisions|decisions]] — índice espelhado dos ADRs
- [[Caos/memory/patterns|patterns]] — padrões de código + padrão de escrita de quest
- [[Caos/memory/restrictions|restrictions]] — restrições técnicas, legais, custo, produto
- [[Caos/memory/learnings|learnings]] — aprendizados (hipóteses de fundação a validar)
- [[Caos/memory/bugs|bugs]] — áreas de risco a vigiar + template de bug

## 📚 Documentação (document-first · 00 → 11)

- [[Caos/docs/00_VISAO/visao-produto|00 · Visão do Produto]]
- [[Caos/docs/01_ARQUITETURA/arquitetura|01 · Arquitetura]] (SPA/PWA + Supabase direto)
	- [[Caos/docs/01_ARQUITETURA/escalabilidade|↳ Escalabilidade]] (projeção 500 / 10 mil / 1 mi usuários)
- [[Caos/docs/02_DESIGN_SYSTEM/design-system|02 · Design System]] (Atmosfera Viral · anatomia do card)
- [[Caos/docs/03_REGRAS_DE_NEGOCIO/regras|03 · Regras de Negócio]] (loop · streak · vidas · cartas · fogo)
- [[Caos/docs/04_MODELAGEM/modelagem|04 · Modelagem]] (ER + entidades)
- [[Caos/docs/05_FLUXOS/fluxos|05 · Fluxos]]
- [[Caos/docs/06_COMPONENTES/componentes|06 · Componentes]] (6 telas v1)
- [[Caos/docs/07_APIS/apis|07 · APIs]] (serviços em src/lib · Edge Functions)
- [[Caos/docs/08_DECISOES/README|08 · Decisões (índice de ADRs)]]
- [[Caos/docs/09_BACKLOG/backlog|09 · Backlog]] (roadmap v1/v2/v3 + parking lot)
- [[Caos/docs/10_PROMPTS/prompts|10 · Prompts]] (curadoria + checklist de aprovação)
- [[Caos/docs/11_SEGURANCA/plano-seguranca|11 · Segurança]] (threat model · RLS · LGPD)

## ⚖️ Decisões (ADRs 001 → 010)

- [[Caos/docs/08_DECISOES/adr-001-stack|ADR-001 · Stack (React+TS+Vite PWA · Supabase · Vercel · Web Push)]]
- [[Caos/docs/08_DECISOES/adr-002-uma-quest-por-dia|ADR-002 · Uma quest sincronizada por dia]]
- [[Caos/docs/08_DECISOES/adr-003-cartas-e-temporadas|ADR-003 · Cartas do Caos + temporadas de 90 dias]]
- [[Caos/docs/08_DECISOES/adr-004-quests-curadas|ADR-004 · Quests curadas por humanos]]
- [[Caos/docs/08_DECISOES/adr-005-vidas|ADR-005 · Vidas (1/24h)]]
- [[Caos/docs/08_DECISOES/adr-006-verificacao-sem-video|ADR-006 · Verificação honor + link (ZERO infra de vídeo)]]
- [[Caos/docs/08_DECISOES/adr-007-fogo-do-caos|ADR-007 · Fogo do Caos (streak em dupla)]]
- [[Caos/docs/08_DECISOES/adr-008-monetizacao|ADR-008 · Monetização (loop grátis + CAOS+)]]
- [[Caos/docs/08_DECISOES/adr-009-nome-e-marca|ADR-009 · Nome e marca]]
- [[Caos/docs/08_DECISOES/adr-010-single-tenant|ADR-010 · Single-tenant B2C (exceção consciente)]]
- [[Caos/docs/08_DECISOES/adr-000-template|— template de ADR]]

## 🗄️ Dados

- [[Caos/supabase/schema.sql|schema.sql]] — 8 tabelas, RLS obrigatória em todas (isolamento por `auth.uid()`)

---

## 🔒 Princípios inegociáveis (resumo)

- **Intuitividade** é o princípio nº1 de UX (sem manual).
- **O loop é grátis pra sempre** — monetiza-se proteção/status/extra.
- **O card é reconhecível em 0,5s** — o card é o marketing.
- **ZERO infra de vídeo** · **RLS em toda tabela** · custo em tier gratuito.
- **B2C single-tenant** — exceção consciente ao padrão white-label ([[Caos/docs/08_DECISOES/adr-010-single-tenant|ADR-010]]).

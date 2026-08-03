# Respostas do Intake — Caos Diário

> Fonte de verdade das respostas da entrevista de fundação. O `scaffold.sh` lê
> este arquivo para substituir os placeholders. Preencha durante a Fase 1.
> Data do intake: 2026-07-24 · Conduzido por: Matheus (Kora Business Network)

## Bloco 1 — Produto e identidade
- **PRODUTO (nome + essência):** Caos Diário
- **ESSENCIA (1 frase):** Todo dia às 7h o Brasil recebe a mesma quest absurda; você cumpre, filma e posta no TikTok. Streak de quem sobrevive ao caos.
- **PROBLEMA que resolve:** Apps de hábito/streak são solitários e sem alcance; o TikTok tem alcance mas nada transforma o desafio diário num jogo coletivo nacional.
- **PROPOSTA de valor / diferencial:** Quest SINCRONIZADA nacional — todos recebem a MESMA quest no MESMO dia. O sync é o produto; CAC zero via TikTok.
- **Existe código ou é do zero?** Do zero (greenfield)

## Bloco 2 — Público e escopo
- **PUBLICO_ALVO primário:** 16–30 anos, usuários pesados de TikTok, Brasil
- **PERSONAS (1-3):** O Caçador de Streak; O Viralizador; O Colecionador de Cartas
- **B2B / B2C / B2B2C:** B2C
- **"Aha moment":** Cumprir a 1ª quest, postar, ver o feed do TikTok encher da mesma cena e ganhar a carta do dia

## Bloco 3 — Multi-tenant e white-label
- **MULTI_TENANT:** single-definitivo  <!-- multi-desde-já / single-agora-multi-roadmap / single-definitivo -->
- **WHITE_LABEL:** não     <!-- sim / não -->
- **PLANOS (free/pro/enterprise):** Free (loop grátis pra sempre) · CAOS+ (R$ 9,90/mês · R$ 79/ano)

## Bloco 4 — Stack e arquitetura
- **STACK:** React + TypeScript + Vite (PWA) · Supabase (auth/Postgres/RLS) · Vercel · Web Push
- **MODELO_ARQUITETURA:** A — SPA (PWA) + BaaS (Supabase direto)  <!-- A: SPA+BaaS / B: API própria / C: serviço sem UI -->
- **TEM_UI:** Sim
- **DEPLOY:** Vercel (deploy automático no push para main)
- **SCHEMA_PATH:** supabase/schema.sql
- **ENV_PREFIX:** import.meta.env.VITE_*  <!-- ex: import.meta.env.VITE_* -->
- **TEST_CMD:** npm test       <!-- ex: npm test -->

## Bloco 5 — Segurança e compliance
- **Trata dado pessoal/financeiro/de menores?** Sim — público jovem (16+, alguns menores), URL pública de TikTok; sem dado financeiro na v1 (assinatura só na fase 2)
- **COMPLIANCE específico:** LGPD  <!-- LGPD / GDPR / PCI / fiscal / nenhum -->
- **Nível de isolamento entre clientes:** Single-tenant; isolamento por usuário via RLS (auth.uid())

## Bloco 6 — Custo
- **FASE_CUSTO:** bootstrap gratuito (alvo R$ 0/mês na v1)  <!-- bootstrap gratuito / com orçamento -->
- **Serviços pagos já aprovados:** Nenhum na v1

## Bloco 7 — Design (se tem UI)
- **Identidade visual definida?** Sim — estética Atmosfera Viral
- **Referências / tom visual:** Preto profundo, branco, vermelho escuro, grain/haze, texto mínimo, emoção sobre informação
- **Contexto de uso crítico:** Mobile (PWA), toque, feed rápido — o card tem que ser reconhecível em 0,5s  <!-- toque/PDV, mobile, desktop -->
- **PRINCIPIO_N1:** INTUITIVIDADE  <!-- default UI: INTUITIVIDADE -->

## Roadmap inicial
- **FASE_ATUAL:** v1 (MVP)
- **Próximas fases:** v2 (Fogo do Caos + monetização camadas 1–2 + Modo Insano) · v3 (temporadas, colab, cartas físicas, patrocínio)

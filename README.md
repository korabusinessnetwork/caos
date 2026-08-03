# Caos Diário

> Todo dia às 7h, o Brasil inteiro recebe a **mesma** quest absurda. Você cumpre,
> filma, posta no TikTok com a hashtag do dia. Streak de quem sobrevive ao caos.

Jogo diário de quests sincronizadas nacionalmente. O app é a camada de jogo
(streak, vidas, cartas); o vídeo no TikTok é o canal de aquisição (CAC zero).
Não hospedamos vídeo — guardamos só a URL.

## Status

**Em fundação.** A camada de governança e documentação está pronta. **Nenhuma
linha de código de aplicação antes do checklist de validação da fundação passar**
(ver `CLAUDE.md` e `docs/`).

## Stack (ADR-001)

- **Front:** React + TypeScript + Vite — **PWA** (sem app store)
- **Backend:** Supabase (auth · Postgres · RLS obrigatória · Edge Functions)
- **Deploy:** Vercel (auto-deploy no push para `main`)
- **Push:** Web Push via service worker
- **Custo alvo v1:** R$ 0/mês

## Estrutura do repositório

```
CLAUDE.md            # constituição do projeto (fonte de verdade)
memory/              # governança viva: identity · decisions · patterns · learnings · restrictions · bugs
docs/                # 00_VISAO → 11_SEGURANCA (document-first) + 08_DECISOES (ADRs)
supabase/            # schema.sql · migrations · functions · seeds  (RLS = definition-of-done)
src/                 # código da aplicação (organizado por feature; serviços em src/lib/)
scripts/             # utilitários
CAOS_FUNDACAO.md     # documento-mestre de fundação (intake original)
```

## Por onde começar

1. Leia `CLAUDE.md` (princípios inegociáveis).
2. `docs/00_VISAO/visao-produto.md` (o quê e por quê).
3. `docs/08_DECISOES/README.md` (ADR-001 a ADR-010 — as decisões já fechadas).
4. `docs/03_REGRAS_DE_NEGOCIO/regras.md` (o loop, streak, vidas, cartas, fogo).
5. `INSTALACAO.md` (setup do ambiente — fase de código).

## Princípios inegociáveis (resumo)

- **Intuitividade** é o princípio nº1 de UX (sem manual).
- **O loop é grátis pra sempre**; monetiza-se proteção/status/extra (ADR-008).
- **O card é reconhecível em 0,5s** — o card é o marketing.
- **ZERO infra de vídeo** (ADR-006). **RLS em toda tabela.** Custo em tier gratuito.
- **B2C single-tenant** — exceção consciente ao padrão white-label (ADR-010).

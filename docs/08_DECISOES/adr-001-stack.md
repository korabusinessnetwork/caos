# ADR-001 — Stack: React + TS + Vite (PWA) · Supabase · Vercel · Web Push

**Status**: Aceito
**Data**: 2026-07-24
**Decisores**: Matheus (Kora Business Network)
**Supersede**: —
**Supersedido por**: —

---

## Contexto

Precisamos nascer com custo próximo de zero (aposta é o viral, não capital), mobile-first,
com auth e banco seguros, e capaz de enviar push diário sincronizado às 7h. Sem time de
infra; um fundador tocando o desenvolvimento.

## Decisão

- **Frontend:** React + TypeScript + Vite, entregue como **PWA** na v1 (sem app store).
- **Backend:** Supabase free (auth, Postgres, **RLS obrigatória em toda tabela**, Edge Functions).
- **Deploy:** Vercel free, deploy automático no push para `main`.
- **Push:** Web Push via service worker (grátis).
- **Vídeo:** ZERO infra — o TikTok hospeda (ver ADR-006).
- **Custo mensal alvo da v1: R$ 0.**
- Convenções: SQL `snake_case` · JS/TS `camelCase` · componentes `PascalCase` · migrations `YYYYMMDD_descricao.sql`.

## Alternativas Consideradas

- **App nativo (React Native / Flutter + lojas):** prós = push nativo, presença na store;
  contras = fricção de publicação, custo de conta de desenvolvedor, atualização lenta.
  Descartado na v1: PWA basta e remove a fricção da store.
- **Firebase:** prós = realtime/auth prontos; contras = RLS/SQL limitados, custo imprevisível,
  lock-in. Descartado: preferimos Postgres + RLS explícita.
- **Backend próprio (Node/API):** contras = mais ops e custo. Descartado: BaaS é suficiente
  na v1; migra-se lógica quente pra API própria só se o viral exigir (novo ADR).

## Consequências

- **Positivas:** custo zero, velocidade de entrega, Postgres real com RLS, deploy contínuo.
- **Trade-offs:** PWA tem push/instalação menos "premium" que nativo; Web Push no iOS exige
  o app "adicionado à tela". Lock-in do Supabase mitigado por schema Postgres puro e camada `src/lib/`.

## Referências
- `docs/01_ARQUITETURA/arquitetura.md`
- CAOS_FUNDACAO.md §8
- `memory/restrictions.md` — restrições de custo

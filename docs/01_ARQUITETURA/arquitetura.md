# Arquitetura — Caos Diário

> Fonte: CAOS_FUNDACAO.md §8. Decisão em ADR-001. Modelo: SPA (PWA) + BaaS.
> Última atualização: 2026-07-24.

## Modelo escolhido: A — SPA (PWA) + BaaS (Supabase direto)

O front-end (React PWA) fala **direto** com o Supabase (auth + Postgres com RLS).
Não há API própria intermediária na v1. Lógica sensível ou com privilégio
(publicar a quest do dia, agendar push, conceder cartas) roda em **Edge Functions**.

```
┌─────────────────────────────────────────────┐
│  Cliente — React + TS + Vite (PWA)          │
│  · Service Worker (Web Push + offline shell) │
│  · Camada de serviços  src/lib/*             │  ← único ponto que fala com Supabase
└───────────────┬─────────────────────────────┘
                │ supabase-js (chave ANON)
                ▼
┌─────────────────────────────────────────────┐
│  Supabase (free tier)                        │
│  · Auth (e-mail / OAuth)                     │
│  · Postgres + RLS OBRIGATÓRIA em toda tabela │
│  · Edge Functions (privilégio service_role)  │
│      - publicar quest do dia (cron)          │
│      - disparar Web Push (7h/12h/20h/22h)    │
│      - conceder carta / calcular streak      │
└─────────────────────────────────────────────┘
                │
                ▼
        TikTok (hospeda o vídeo — guardamos só a URL)
```

## Por que este modelo

- **Custo zero na v1:** Supabase free + Vercel free + Web Push nativo (ADR-001).
- **Velocidade:** sem backend próprio pra manter; RLS faz a autorização.
- **Escala é problema futuro:** se e quando o viral exigir, migra-se lógica quente
  pra API própria — registrar em novo ADR. Não otimizar prematuramente.
  Projeção de capacidade (500 / 10 mil / 1 mi usuários) em `escalabilidade.md`.

## Camada de serviços (`src/lib/`)

Regra dura: **nenhum componente chama `supabase.from(...)` direto.** Todo acesso
passa por um módulo de domínio em `src/lib/`, um por área:

| Módulo | Responsabilidade |
|---|---|
| `src/lib/auth.ts` | login, logout, sessão, exclusão de conta (LGPD) |
| `src/lib/quests.ts` | quest do dia, arquivo, cumprir/pular |
| `src/lib/streak.ts` | leitura de streak, cálculo na virada do dia |
| `src/lib/lives.ts` | vidas (1/24h), consumo, freeze |
| `src/lib/cards.ts` | cartas ganhas, álbum, raridade, selo PROVADO |
| `src/lib/push.ts` | inscrição Web Push, permissão |

Isso isola o backend: trocar de BaaS mexe só em `src/lib/`.

## Deploy

- **Vercel free**, deploy automático no push para `main`.
- PWA: `manifest.json` + service worker; sem app store na v1.

## O que a Edge Function faz (e o front NÃO)

- Publicar a quest do dia no horário (única fonte da "quest de hoje").
- Disparar os 4 pushes diários.
- Operações que precisam de `service_role` (nunca exposto ao cliente).

## Fronteiras e não-metas

- **Sem infra de vídeo** (ADR-006): nada de upload, transcode, CDN, live.
- **Sem multi-tenant** (ADR-010): isolamento por usuário via `auth.uid()`, não por `tenant_id`.
- **Sem gateway de pagamento na v1** (adiado — ver `memory/restrictions.md`).

## Ligações
- `docs/01_ARQUITETURA/escalabilidade.md` — projeção de capacidade e custo por cenário.
- `docs/04_MODELAGEM` — tabelas e RLS.
- `docs/11_SEGURANCA` — plano de segurança por camada.
- `docs/07_APIS` — contrato dos serviços e Edge Functions.
- `supabase/schema.sql` — fonte de verdade do schema.

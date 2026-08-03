# Escalabilidade — Projeção de Capacidade · Caos Diário

> Complementa `arquitetura.md` e ADR-001. Responde: **até onde o tier gratuito
> aguenta, onde quebra e quanto custa** em três cenários de usuários.
> Última atualização: 2026-07-24.
>
> ⚠️ **Projeção, não garantia.** Números de tier/preço são de referência (base
> conhecida até 2026) — confirmar no pricing vigente de Supabase/Vercel antes de
> qualquer decisão de custo. Cenário viral tem incerteza alta; tratar como
> hipótese a validar (ver `memory/learnings.md`).

---

## Cenários

| # | Nome | Usuários registrados | DAU (~60%) | Fase |
|---|---|---|---|---|
| **A** | Beta / lançamento | **500** | ~300 | Validação do loop |
| **B** | Tração | **10.000** | ~6.000 | Product-market fit |
| **C** | Viral nacional | **1.000.000** | ~600.000 | Escala |

## Premissas de carga (por usuário ativo/dia)

- **1 sessão/dia** no mínimo (o pico é às **7h**, quando a quest sai — todo mundo abre junto).
- **~10 leituras/sessão** (quest do dia, streak, vidas, perfil, álbum).
- **~3 escritas/dia** (CUMPRI, atualização de streak, eventual vida/carta).
- **4 pushes/dia** para todo inscrito (7h/12h/20h/22h).
- **1 completion/dia** por quem cumpre (~70% do DAU).
- Vídeo mora no TikTok → **egress de vídeo = 0** (guardamos só a URL).

---

## Projeção por dimensão

Legenda: 🟢 folgado no free · 🟡 aguenta com vigilância/mitigação · 🔴 estoura o free / exige infra nova.

| Dimensão | Limite free (ref.) | A · 500 | B · 10 mil | C · 1 mi |
|---|---|---|---|---|
| **Auth MAU** (Supabase) | ~50.000 | 🟢 500 | 🟢 10 mil | 🔴 1 mi (Pro inclui 100k + overage) |
| **Completions/mês** (linhas novas) | — | 🟢 ~6 mil | 🟡 ~126 mil | 🔴 ~12,6 mi |
| **Crescimento do banco** (~250 B/linha) | 500 MB | 🟢 ~2 MB/mês | 🟡 ~35 MB/mês (≈1 temporada no free) | 🔴 GBs/mês → particionar + arquivar |
| **Egress API** (payloads) | 5 GB/mês | 🟢 | 🟡 (cards renderizados no cliente ajudam) | 🔴 → CDN + Pro |
| **Pico das 7h** (leitura simultânea) | compute compartilhado | 🟢 | 🟡 servir quest via cache | 🔴 quest do dia **tem** que vir de CDN/edge, não do Postgres por request |
| **Web Push enviados/dia** | infra própria de disparo | 🟢 2 mil/dia | 🟡 40 mil/dia (cron em lote) | 🔴 4 mi/dia (120 mi/mês) → worker dedicado + fila |
| **Virada do dia** (`fechar-o-dia`) | 1 Edge Function/dia | 🟢 varre em memória | 🟡 páginas de 1000 + upsert em lote | 🔴 job paginado por fila (não 1 função síncrona varrendo 1 mi) |
| **Realtime concorrente** | ~200 conexões | 🟢 (evitar no loop) | 🟡 (cap, sem realtime no 7h) | 🔴 inviável em massa → não usar realtime no loop |
| **Bandwidth Vercel** | 100 GB/mês | 🟢 | 🟢 (assets cacheiam) | 🔴 → Pro + overage |
| **Edge Functions** | ~500 mil invocações/mês | 🟢 | 🟡 | 🔴 → mover lógica quente p/ worker/API |

---

## Onde cada tier quebra

- **A (500):** tudo no free, folgado. **Custo ≈ R$ 0.** Só existe pra provar o loop.
- **B (10 mil):** o free **ainda serve por temporada (90 dias)**, mas com três vigilâncias:
  1. **Pico das 7h** — servir a quest do dia de cache (é idêntica pra todos), nunca 1 query/usuário.
  2. **Arquivamento de `completions`** — mover temporadas encerradas pra tabela fria antes dos 500 MB.
  3. **Push em lote** — um cron que varre inscritos em batches, não 1-a-1 síncrono.
  Opcional: **Supabase Pro (~US$ 25/mês)** por conforto (sem pause do projeto, backups diários) — decisão do dono.
- **C (1 mi):** **estoura o free e exige evolução de arquitetura.** Dispara a cláusula
  do ADR-001 ("migrar lógica quente pra API própria se o viral exigir") → **novo ADR**.
  Mudanças estruturais obrigatórias:
  - **Quest do dia via CDN/edge cache** (objeto único, publicado 7h) — protege o Postgres do pico.
  - **`completions` particionada por temporada** + arquivamento em storage frio.
  - **Worker de push dedicado** (fila + workers, rate-limit por provedor) fora das Edge Functions.
  - **Zero realtime no loop**; realtime só em feature de nicho com teto.
  - **Vercel Pro** (Hobby é não-comercial — e o Caos monetiza via CAOS+).

---

## Custo estimado (ordem de grandeza, R$/mês)

> Câmbio de referência ~US$ 1 = R$ 5,5. **Estimativa** — confirmar no pricing atual.

| Cenário | Infra | Estimativa |
|---|---|---|
| **A · 500** | Tudo free | **R$ 0** |
| **B · 10 mil** | Free (ou Supabase Pro opcional) | **R$ 0** → ~R$ 140 se optar por Pro |
| **C · 1 mi** | Pro + overage MAU + compute + worker de push + Vercel Pro | **ordem de R$ 15–20 mil** (dominado pelo overage de MAU) |

## Sustentabilidade no cenário viral (unit economics)

Isto é o que fecha a conta e sustenta o **loop grátis pra sempre** (ADR-008):

- 1 mi usuários × **2% de conversão** para CAOS+ (R$ 9,90) ≈ **20 mil assinantes ≈ R$ 198 mil/mês bruto**.
- Infra no pico (~R$ 15–20 mil/mês) cabe com folga → **o grátis se paga com ~2% de conversão.**
- ⚠️ **Hipótese a validar**: a taxa de conversão real e o custo de gateway (~5–8%) só se
  conhecem em produção. Registrar em `memory/learnings.md` quando houver dado.

---

## Gatilhos de decisão (quando agir)

| Gatilho | Ação | Vira ADR? |
|---|---|---|
| Banco perto de 500 MB / fim de temporada | Arquivar `completions`; avaliar Pro | Não (operacional) |
| MAU perto de 50 mil | Assinar Supabase Pro | Não (mudança de tier) |
| Push > ~100 mil/dia ou latência no 7h | Worker de push dedicado + fila | **Sim** |
| Pico das 7h estressando o Postgres | Quest do dia via CDN/edge cache | **Sim** |
| Lógica quente virando gargalo no BaaS | Migrar para API própria (parcial) | **Sim** (supersede parte do ADR-001) |

## Princípios que não mudam com a escala

- **RLS obrigatória em toda tabela** — isolamento por `auth.uid()` (ADR-010), em qualquer cenário.
- **`service_role` nunca no front** — só no worker/Edge.
- **ZERO infra de vídeo** (ADR-006) — o gargalo mais caro dos apps de vídeo nós simplesmente não temos.
- **Custo é decisão do dono** — todo salto pago é apresentado (custo × alternativa × impacto), nunca assumido (ver `CLAUDE.md` e `memory/restrictions.md`).

## Ligações

- `docs/01_ARQUITETURA/arquitetura.md` — modelo atual (SPA/PWA + Supabase direto).
- `docs/08_DECISOES/adr-001-stack.md` — decisão de stack e cláusula de migração.
- `docs/08_DECISOES/adr-006-verificacao-sem-video.md` — por que não há infra de vídeo.
- `docs/08_DECISOES/adr-008-monetizacao.md` — CAOS+ e o loop grátis.
- `memory/restrictions.md` — restrições de custo (bootstrap R$ 0).
- `memory/learnings.md` — hipóteses de conversão/custo a validar em produção.

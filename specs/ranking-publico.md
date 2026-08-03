# Spec — Ranking público de dias provados (`ranking-publico`)

> Rodada 6 do loop. Passo 1 (planejar). Destrava a decisão LGPD que estava parada
> desde a Rodada 1. **Decisão do dono (2026-08-02):** expor top streaks com
> **apelido opt-in** e **só dias provados**. Backlog: "Ranking oficial (só dias provados)".

## 1. Escopo

Vertical slice do leaderboard nacional de **dias provados** (nº de CUMPRIs com link
do TikTok, `completions.provado = true`), exibindo **apenas usuários que optaram
por aparecer** (`profiles.ranking_publico = true`), com **apelido** (`username`) e
a contagem. Inclui: migration (coluna opt-in + view agregada + grants), serviços
de leitura e de opt-in, a tela `Ranking` no fluxo real e o toggle de opt-in no `Perfil`.

## 2. Fora de escopo

- **Aba "fogos mais longos"**: Fogo do Caos é ADR-007 **fase 2** — a aba continua demo-only; no fluxo real fica `empty`.
- Ranking por streak bruto (não-provado): a decisão do dono é **só dias provados** — não expomos streak não-provado.
- Paginação/scroll infinito: top N (padrão 50) basta na v1.
- Filtros regionais, amigos, semanal/temporada: itens futuros.
- Realtime: a lista é lida on-mount; sem subscription.
- Reautenticação para opt-in; captação de qualquer dado novo além do flag booleano.

## 3. Origem e decisões que este item honra

- **Decisão do dono (2026-08-02)**: apelido **opt-in**, **só dias provados** (registrar depois em ADR — proposta ao fim).
- Backlog v1/fase 2: "Ranking oficial (só dias provados)".
- **LGPD** (`docs/11_SEGURANCA`, público 16+): **opt-out por padrão** (`default false`); expõe só o apelido que o próprio usuário escolheu + uma contagem; **sem** `user_id`, e-mail ou qualquer PII; opt-out a qualquer momento remove da lista.
- **ADR-010** (isolamento por `auth.uid()`): a RLS por usuário impede o cliente de contar dados alheios → a agregação roda numa **view no servidor** (definer), que expõe só o resultado minimizado; as tabelas-base mantêm a RLS.
- Segurança (CLAUDE.md): campos explícitos, sem `select *` em tabela com dado pessoal; `anon` lê **só a view**, nunca `completions`.
- Reusa `EntradaRanking` (`tipos.ts`) e o `DEMO_RANKING_STREAK` (demo inalterado).

## 4. Arquivos afetados

- **novo** `supabase/migrations/20260802_ranking_publico.sql` — `profiles.ranking_publico boolean not null default false`; **função `security definer`** `ranking_dias_provados(limite int)` (agrega e minimiza); `grant execute` a `anon, authenticated`.
- **edita** `supabase/schema.sql` — espelha a coluna, a função e o grant (+ nota LGPD de minimização).
- **edita** `src/lib/tipos.ts` — `Perfil.rankingPublico: boolean`.
- **edita** `src/lib/perfil.ts` — inclui `ranking_publico` no select/retorno; adiciona `definirRankingPublico(ativo)`.
- **novo** `src/lib/ranking.ts` — `buscarRankingProvados(limite = 50)` chama a função via `rpc` → `EntradaRanking[]` (posição derivada no cliente).
- **edita** `src/pages/Ranking.tsx` — ramo real da aba de streaks carrega `buscarRankingProvados`; rótulo honesto ("mais provados"); aba de fogo segue fase-2 (empty no real).
- **novo** `src/components/shared/ToggleRanking.tsx` + `.css` — toggle de opt-in (só fluxo real).
- **edita** `src/pages/Perfil.tsx` — renderiza `ToggleRanking` (só `!modoDemo`).
- **edita** `supabase/functions/README.md` **ou** `docs/01_ARQUITETURA/escalabilidade.md` — nota: view agregada a 10k; a 1M vira tabela materializada/refresh agendado (projeção).

Convenções: SQL snake_case, JS camelCase, componente PascalCase + CSS separado, tokens `--caos-*`, identificadores de domínio em português, migration `YYYYMMDD_descricao.sql`.

## 5. Critérios de aceite

1. Migration adiciona `profiles.ranking_publico boolean not null default false` (**opt-out por padrão**, idempotente com `if not exists`).
2. A função `ranking_dias_provados(limite)` retorna **apenas** `username` e `dias_provados` (contagem de `completions` com `provado = true`), **só** para usuários com `ranking_publico = true`; **não** retorna `user_id`, e-mail ou qualquer outra coluna.
3. A função é `security definer` com `set search_path = public` e `limite` limitado (clamp ≤ 200): agrega entre usuários de propósito (para o total minimizado), mas as tabelas-base **continuam** com RLS intacta; `anon`/`authenticated` recebem `execute` **na função**, e nenhuma policy nova abre `completions`/`streaks` para leitura alheia.
4. `buscarRankingProvados(limite)` chama a função via `supabase.rpc`, recebe `{ username, dias_provados }[]` já ordenado, e mapeia para `EntradaRanking` com `posicao` 1..N derivada e `valor = dias_provados`.
5. `Ranking.tsx` (ramo real, aba de provados): carrega via `buscarRankingProvados`; lista vazia → estado `empty` (não `error`); erro real → estado `error`. O rótulo da aba reflete "dias provados" (não promete "streak" cru).
6. `definirRankingPublico(ativo)` atualiza `profiles.ranking_publico` do **próprio** usuário (RLS `profiles_write_own`); valida sessão; erro tratado.
7. `ToggleRanking` (Perfil, só `!modoDemo`): mostra o estado atual (lido de `perfil.rankingPublico`), permite ligar/desligar, reflete carregando/erro, deixa claro que **liga a exposição do apelido** no ranking nacional. Em `MODO_DEMO` não aparece.
8. `MODO_DEMO` inalterado: `Ranking` segue com `DEMO_RANKING_STREAK`/`DEMO_RANKING_FOGO`; `Perfil` sem toggle.
9. Segurança/qualidade: sem `select *` em tabela pessoal; sem segredo hardcodado; sem log de dado sensível; sem `console.log`/TODO solto; só tokens `--caos-*`; CSS separado.
10. Sem regressão: `npm test` verde (32), `tsc` limpo, `vite build` OK; `Ranking` e `Perfil` carregam no browser (MODO_DEMO) como antes (ranking demo aparece; toggle **não** aparece no demo).

## 6. Edge cases conhecidos

- **Ninguém opt-in / ninguém com dia provado**: view vazia → aba em `empty`, sem erro.
- **Empate em dias_provados**: ordem estável por `dias_provados desc` (desempate secundário por `username` para determinismo).
- **Opt-out**: desligar o flag remove o usuário da view na próxima leitura (filtro `ranking_publico = true`).
- **Usuário sem apelido**: `username` é `not null` no schema → sempre há apelido.
- **`MODO_DEMO`**: nenhuma chamada de rede; toggle escondido (sem sessão real).
- **Reentrância no toggle**: trava enquanto grava (sem duplo disparo).
- **10k×90 dias**: a view conta em memória — ok; a 1M vira materialized view com refresh agendado (só projeção documental).

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios em **sim**; `npm test` verde (sem regressão nas 32 puras); `tsc` limpo e
`vite build` OK; sem `console.log` nem TODO solto; verificado no browser (MODO_DEMO) que `Ranking`
mostra a lista demo e `Perfil` **não** mostra o toggle no demo — e leitura do código/SQL confirma que a
função expõe só `username`+`dias_provados` de opt-ins, que as tabelas-base mantêm RLS, e que o opt-in é
opt-out por padrão. (Proposta de ADR registrando a decisão do dono apresentada no `/aprender`.)

---

## Resultado da review (rodada 6 — 2026-08-02)

**Aprovado sem ressalvas.** 10/10 critérios em sim; suíte verde (32), `tsc` limpo, `vite build` OK.
Sem correção na review. Verificado no browser (MODO_DEMO): aba "mais dias provados" + lista demo (5
linhas), `Perfil` **sem** toggle no demo, sem erro no console. SQL/código conferidos:

- `ranking_dias_provados(limite)`: `security definer`, `set search_path = public`, `limit least(greatest(coalesce(limite,50),1),200)`; retorna só `username` + `dias_provados`; filtra `ranking_publico = true` e `provado = true`; `grant execute` a `anon, authenticated`; nenhuma policy nova abre `completions`/`streaks`.
- `ranking_publico` boolean **default false** (opt-out); `definirRankingPublico` escreve só a própria linha (`profiles_write_own`).
- `buscarRankingProvados` via `rpc`, deriva posição; `Ranking.tsx` distingue `empty` (ninguém opt-in) de `error`; label honesto; aba de fogo fica `empty` no real (fase 2).
- `ToggleRanking` gated `!modoDemo`, estados salvando/erro, copy deixa claro que expõe o @apelido.

Fica para próximas rodadas: cache curto/materialized view a partir de ~10k (nota em escalabilidade);
desempate mais rico; ranking semanal/temporada; teste E2E do opt-in real (gated off no demo).

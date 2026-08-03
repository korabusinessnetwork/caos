# Spec — Calendário real do streak (`calendario-real`)

> Rodada 3 do loop. Passo 1 (planejar). Fecha o TODO deixado em `Streak.tsx`
> ("histórico por dia … entra no M4; por ora a grade mostra só o mês corrente"):
> no fluxo real a grade do mês vem **vazia** porque `diasCumpridos` é `[]` fixo.

## 1. Escopo

Novo serviço `buscarDiasCumpridos(ano, mes)` (leitura de `completions` do mês
corrente do usuário autenticado) que devolve os **dias-do-mês** (1..31, fuso SP)
em que houve CUMPRI, e ligá-lo ao ramo real de `Streak.tsx` — a grade do
calendário passa a refletir os CUMPRIs de verdade em vez de vir vazia. `MODO_DEMO`
segue usando `DEMO_DIAS_CUMPRIDOS`.

## 2. Fora de escopo

- **Navegação entre meses** (voltar/avançar): a grade continua só o mês corrente.
- **Histórico multi-mês / paginação**: um mês por leitura basta.
- Alterar `montarCalendario` ou o CSS da grade (o formato `number[]` já é o que ela consome).
- Backend/Edge Functions/migrations: **nada** (a RLS `completions_select_own` já permite a leitura).
- Recalcular streak no cliente — continua sendo do servidor (`processar-cumpri`/`fechar-o-dia`).
- Marcar "dia perdido"/vida gasta no calendário (visual de falha) — item futuro.

## 3. Origem e decisões que este item honra

- Loop central (`regras.md`): o calendário é o espelho do streak — precisa ser real pra motivar.
- **ADR-002** (dia do caos = data-calendário no fuso SP): o dia da célula vem de `chaveDiaCaos`, não do relógio local cru.
- **ADR-010** (isolamento por `auth.uid()`): lê só as próprias `completions` (RLS + filtro por `user_id`).
- Segurança (CLAUDE.md): campos explícitos (nunca `select *` em `completions`), auth checada antes da leitura.
- Reusa `chaveDiaCaos` (`dominio/datas.ts`, testada) e o padrão de leitura de `completions` de `jaCumpriu` (`quests.ts`).
- Não catalogado como item isolado no backlog — `/aprender` registra.

## 4. Arquivos afetados

- **edita** `src/lib/streak.ts` — adiciona `buscarDiasCumpridos(ano, mes)` (leitura de `completions` do intervalo do mês, mapeando `completed_at` → dia-do-mês via `chaveDiaCaos`).
- **edita** `src/pages/Streak.tsx` — no ramo real, chama `buscarDiasCumpridos` (junto do `Promise.all` atual) e usa o resultado em `setDiasCumpridos`, no lugar do `[]` fixo; remove o TODO correspondente.

Convenções: serviço na camada `src/lib/`, campos snake_case no banco / camelCase no app, identificadores de domínio em português.

## 5. Critérios de aceite

1. `buscarDiasCumpridos(ano, mes)` lê `completions` do usuário autenticado (checa `supabase.auth.getUser()`; sem sessão → erro claro, como `buscarStreak`).
2. Filtra por `user_id == auth.uid()` **e** `completed_at` dentro do intervalo `[início do mês, início do mês seguinte)`; **campos explícitos** (`completed_at`), nunca `select *`.
3. Cada `completed_at` vira o **dia-do-mês** pela data-calendário SP (`chaveDiaCaos`), consistente com a definição de "dia do caos" (ADR-002) — não pelo dia UTC cru.
4. Retorna `number[]` de dias distintos (1..31) do mês pedido; meses sem CUMPRI → `[]` (sem erro).
5. `Streak.tsx` (ramo real) popula `diasCumpridos` com o retorno do serviço; a grade marca esses dias como `--cumprido`. O TODO "grade mostra só o mês corrente" some.
6. A leitura entra no `Promise.all` existente (ou paralela) e uma falha dela cai no mesmo `catch` → estado `error` com "tenta de novo" (não quebra a tela nem some com o streak já lido).
7. `MODO_DEMO` inalterado: continua usando `DEMO_DIAS_CUMPRIDOS`.
8. Sem `select *`, sem segredo hardcodado, sem log de dado pessoal, sem `console.log`/TODO solto novo.
9. Sem regressão: `npm test` verde (32), `tsc` limpo, `vite build` OK; a tela Streak carrega no browser (MODO_DEMO) igual a antes.

## 6. Edge cases conhecidos

- **Mês sem nenhum CUMPRI**: `[]`, grade sem dias marcados, sem erro.
- **Sessão expirada**: erro lançado → `catch` do `carregar` → estado `error`.
- **Fuso na virada do mês**: um CUMPRI perto da meia-noite pertence ao dia SP (via `chaveDiaCaos`), não ao dia UTC — evita marcar a célula errada.
- **Dia duplicado**: idempotência do CUMPRI já garante 1 completion por quest/dia; ainda assim o serviço devolve dias **distintos**.
- **Muitos CUMPRIs**: no máximo ~31 linhas no mês — sem paginação necessária.

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios em **sim**; `npm test` verde (sem regressão nas 32 puras); `tsc` limpo e
`vite build` OK; sem `console.log` nem TODO solto; verificado no browser (MODO_DEMO) que a tela
Streak segue carregando e a grade marca os dias — e leitura do código confirma que o ramo real
usa o serviço com filtro por `auth.uid()`, campos explícitos e dia via `chaveDiaCaos`.

---

## Resultado da review (rodada 3 — 2026-08-02)

**Aprovado sem ressalvas.** 9/9 critérios em sim; suíte verde (32 testes), `tsc` limpo, `vite build` OK.
Sem correção na review. Verificado no browser (MODO_DEMO): tela Streak carrega, grade marca 21 dias
(== `DEMO_DIAS_CUMPRIDOS`), sem erro no console. Ramo real conferido por leitura de código:

- `buscarDiasCumpridos` checa `getUser()`, filtra `user_id == auth.uid()` + `completed_at` no intervalo do mês, `select('completed_at')` (sem `select *`).
- Intervalo ancorado em SP (00:00 SP = 03:00 UTC, offset fixo UTC−3); dia da célula por `partesEmSP` (não UTC cru); dias distintos via `Set`.
- Ligado ao `Promise.all` de `Streak.tsx`; falha cai no mesmo `catch` → estado `error`. TODO do M4 removido.

Desvio consciente do critério 2/3 (documentado): o **mês** da consulta usa o `Date` local (mesmo de
`montarCalendario`, para a grade e as marcações ficarem alinhadas), enquanto o **dia** da célula é
resolvido em SP. Público é BR (UTC−3 fixo) ⇒ local ≈ SP, sem divergência. Se um dia houver usuário
fora do fuso BR, alinhar `montarCalendario` ao SP vira item — fora de escopo aqui.

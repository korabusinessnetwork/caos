# Spec — Total da temporada no álbum (`total-temporada`)

> Rodada 4 do loop. Passo 1 (planejar). Fecha o TODO de `AlbumDoCaos.tsx`
> ("o total da temporada … serviço agregado que entra no M4"): no fluxo real
> `totalTemporada` cai em `album.length`, então **nenhuma silhueta faltante**
> aparece — o álbum parece completo mesmo faltando cartas.

## 1. Escopo

Novo serviço `contarCartasTemporada(temporada)` (contagem no catálogo `cards`)
que devolve **quantas cartas** a temporada tem, e ligá-lo ao ramo real de
`AlbumDoCaos.tsx` — as silhuetas das cartas ainda-não-conquistadas passam a
aparecer (`totalTemporada − conquistadas`). A temporada exibida é a da carta mais
recente do usuário. `MODO_DEMO` segue usando `DEMO_TOTAL_TEMPORADA`.

## 2. Fora de escopo

- Conceito/serviço de "temporada corrente" global (navegar entre temporadas): usa-se a temporada da carta mais recente do usuário.
- Catálogo completo de cards / metadados das cartas faltantes (nome/arte da silhueta): a silhueta segue anônima ("?").
- Backend/Edge Functions/migrations: **nada** (a RLS `cards_select_all` já permite a contagem).
- Alterar o grid/CSS do álbum ou a lógica de raridade.
- Álbum vazio: continua caindo no estado `empty` (mensagem de convite) — sem silhuetas nesse caso.

## 3. Origem e decisões que este item honra

- Loop central (colecionar é retenção): ver o que falta é o que puxa o "volta amanhã".
- **ADR-010** (isolamento por usuário): a contagem do catálogo `cards` é pública (`cards_select_all`), mas o álbum lido continua por `auth.uid()`.
- Segurança (CLAUDE.md): contagem via `count` (sem trazer linhas), nunca `select *`.
- Reusa o padrão de serviço de `src/lib/cards.ts` (`buscarAlbum`) e o tipo `CartaAlbum` (já traz `temporada`).
- Espelha a Rodada 3 (`calendario-real`): fechar um TODO "M4" de dado agregado que já é legível pela RLS existente.
- Não catalogado como item isolado no backlog — `/aprender` registra.

## 4. Arquivos afetados

- **edita** `src/lib/cards.ts` — adiciona `contarCartasTemporada(temporada)` (contagem `head/count` na tabela `cards` filtrando `temporada`).
- **edita** `src/pages/AlbumDoCaos.tsx` — no ramo real, quando há cartas, chama `contarCartasTemporada(cartas[0].temporada)` e usa no `setTotalTemporada`, no lugar de `album.length`; remove o TODO correspondente.

Convenções: serviço na camada `src/lib/`, snake_case no banco / camelCase no app, identificadores de domínio em português.

## 5. Critérios de aceite

1. `contarCartasTemporada(temporada)` conta linhas de `cards` com aquela `temporada` via `select('*', { count: 'exact', head: true })` (só o `count`, **sem trazer linhas** nem dado pessoal).
2. Retorna o número (0 se a temporada não tem cards); erro do supabase é propagado como `Error` com mensagem clara.
3. `AlbumDoCaos.tsx` (ramo real): com `album.length > 0`, `totalTemporada = await contarCartasTemporada(album[0].temporada)`; as silhuetas faltantes aparecem quando `total > conquistadas`. O TODO "serviço agregado que entra no M4" some.
4. Se a contagem falhar, cai no `catch` existente → estado `error` (não quebra a tela).
5. Álbum **vazio** segue no estado `empty` (sem chamar a contagem à toa / sem silhuetas).
6. `MODO_DEMO` inalterado: continua com `DEMO_TOTAL_TEMPORADA` (12) e as silhuetas do demo.
7. Sem `select *` em tabela com dado pessoal, sem segredo hardcodado, sem log sensível, sem `console.log`/TODO solto novo.
8. Sem regressão: `npm test` verde (32), `tsc` limpo, `vite build` OK; o álbum carrega no browser (MODO_DEMO) igual a antes (contagem "4/12" e silhuetas).

## 6. Edge cases conhecidos

- **Temporada sem cards cadastrados** (catálogo ainda vazio): `count = 0` → `faltantes = 0`, sem silhueta, sem erro.
- **Álbum vazio**: estado `empty`, contagem não é chamada.
- **`total < conquistadas`** (catálogo incompleto vs. cartas já dadas): `Math.max(0, …)` já protege — 0 silhuetas, sem número negativo.
- **Cartas de temporadas diferentes no álbum**: usa a temporada da mais recente (`album[0]`, já ordenado por `ganha_em desc`); multi-temporada é item futuro.

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios em **sim**; `npm test` verde (sem regressão nas 32 puras); `tsc` limpo e
`vite build` OK; sem `console.log` nem TODO solto; verificado no browser (MODO_DEMO) que o álbum
segue com "4/12" e silhuetas — e leitura do código confirma que o ramo real conta via `count/head`
e usa a temporada da carta mais recente.

---

## Resultado da review (rodada 4 — 2026-08-02)

**Aprovado sem ressalvas.** 8/8 critérios em sim; suíte verde (32), `tsc` limpo, `vite build` OK.
Sem correção na review. Verificado no browser (MODO_DEMO): álbum com "4/12 cartas", 4 cartas + 8
silhuetas, sem erro no console. Ramo real conferido por código:

- `contarCartasTemporada` usa `select('*', { count: 'exact', head: true })` → só o `count`, não traz linhas.
- `AlbumDoCaos` conta pela temporada de `album[0]` (mais recente) só quando há cartas; álbum vazio segue no estado `empty`. TODO do M4 removido.
- `Math.max(0, total − conquistadas)` já protegia catálogo incompleto.

Fica para próximas rodadas: serviço de "temporada corrente" global e navegação multi-temporada
(hoje usa a temporada da carta mais recente).

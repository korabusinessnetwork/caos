# Padrões Consolidados — Caos Diário

## Objetivo
- Registrar padrões validados (não especulação)
- Evitar variação e inconsistência no código e na curadoria
- Acelerar onboarding com guias de implementação

## Contexto
- Stack: React + TypeScript + Vite (PWA) · Supabase (auth/Postgres/RLS) · Vercel · Web Push
- Padrões evoluem com a base de código; deprecados ganham tag [DEPRECADO]
- Alguns padrões aqui são de **conteúdo** (escrita de quest), não só de código

## Regras Gerais
- Padrão de código só entra após validado (produção ou review)
- Padrão obsoleto = tag [DEPRECADO] + data + sucessor
- Padrão de segurança/compliance entra imediatamente

## Validações
- Padrão tem exemplo real (não pseudocódigo)?
- Contraexemplo (anti-padrão) está marcado?

## Permissões
- Tech lead (Matheus): aprova/depreca padrões de código
- Curadoria (Matheus + Guilherme + Macedo): dona do padrão de quest

## Exceções
- Padrão de segurança/compliance: entra sem esperar 2ª revisão

## Auditoria
- Code review checa conformidade
- Curadoria revisa toda quest contra o padrão OBRIGATÓRIO antes de agendar

## Eventos
- `pattern.validated`, `pattern.deprecated`, `pattern.superseded`

## Casos de Uso
- Escrever a quest do dia
- Estruturar um módulo novo (streak, cartas, vidas)
- Treinar curador novo

## Critérios de Aceite
- [x] Padrão de quest documentado com exemplo ✅ e ❌
- [x] Convenções de nomenclatura reais (Caos, não PDV)
- [x] Anti-padrões claros

---

## Padrão OBRIGATÓRIO de Escrita de Quest

> A quest é o produto. Toda quest passa por este padrão antes de ser agendada.
> Curadoria humana (nunca IA em runtime — ADR-004).

**Uma quest válida é:**
1. **Cumprível em < 10 min** — sem preparação, sem gastar dinheiro.
2. **Filmável na vertical, 15–60s** — nasce pra virar vídeo de TikTok.
3. **Absurda mas segura** — nada ilegal, nada perigoso.
4. **Alvo da piada = o usuário** — nunca humilha um terceiro sem consentimento.
5. **Auto-explicativa em 1 frase** — se precisa de parágrafo, foi mal escrita.
6. **Universal** — dá pra cumprir em qualquer cidade, sem depender de lugar específico.

**Tom do enunciado:** seco, imperativo, provocador (ver `identity.md` → Tom de Voz).

✅ "Peça um copo d'água num lugar e vá embora sem pedir mais nada."
✅ "Ligue pra alguém e diga só 'consegui' e desligue."
❌ "Vá até um estabelecimento comercial e realize uma interação social..." (corporativês, longo)
❌ "Assuste um desconhecido na rua." (alvo é terceiro — proibido)
❌ "Compre um café e..." (depende de dinheiro — proibido)

**Metadados de cada quest** (ver `supabase/schema.sql` → tabela `quests`):
`dia (int)`, `enunciado`, `hashtag (#CaosDia{N})`, `carta_id`, `raridade_alvo`, `status (rascunho/aprovada/agendada/publicada)`, `curador`.

## Padrão do Card (reconhecível em 0,5s)

> O card é o canal de aquisição. Se não é reconhecível num scroll de feed, falhou.

- Marca "Caos" fixa (watermark inegociável — nunca removível).
- Estética Atmosfera Viral: preto profundo, vermelho escuro, grain/haze, texto mínimo.
- Hierarquia: raridade legível à distância (Comum < Rara < Lendária < Secreta).
- Selo de estado: `PROVADO` (com link) vs `CUMPRI` (honra).
- Nada de texto denso — emoção sobre informação.

✅ Card com 1 palavra-chave grande + selo + marca no canto
❌ Card com parágrafo de regras da quest

---

## Padrões de Código

### Nomenclatura
- **SQL**: `snake_case` → `quest_id`, `card_rarity`, `streak_count`, `completed_at`
- **JS/TS**: `camelCase` → `questDoDia`, `cumprirQuest`, `fetchStreak`
- **Componentes**: `PascalCase` → `CardDoCaos.tsx`, `StreakBadge.tsx`, `QuestDoDia.tsx`
- **Constantes**: `SCREAMING_SNAKE_CASE` → `VIDA_POR_HORAS = 24`, `HORA_DA_QUEST = 7`
- **Booleans**: `isCumprida`, `canReviver`, `hasStreakAtivo`

✅ `const cumprirQuest = async (questId: string) => { ... }`
❌ `const handleCompleteDailyTask = () => { ... }` (jargão genérico, perde o domínio)

### Migrations
- Formato de arquivo: `YYYYMMDD_descricao.sql` em `supabase/migrations/`
- Ex: `20260724_criar_tabela_quests.sql`, `20260725_add_rls_completions.sql`
- Migration é imutável depois de aplicada; correção = nova migration
- **Toda tabela nasce com RLS habilitado** na mesma migration (definition-of-done)

### Camada de Serviços (`src/lib/`)
- Todo acesso ao Supabase passa por `src/lib/` — componentes **nunca** chamam `supabase.from(...)` direto.
- Um módulo por domínio: `src/lib/quests.ts`, `src/lib/streak.ts`, `src/lib/cards.ts`, `src/lib/lives.ts`, `src/lib/auth.ts`.
- Isso isola o backend: trocar Supabase por outra coisa mexe só em `src/lib/`.

✅ `import { cumprirQuest } from '@/lib/quests'`
❌ `supabase.from('completions').insert(...)` dentro de um componente

### Gerenciamento de Estado
- **Local**: `useState` (o componente é dono do dado)
- **Global**: Context API (`src/context/`) — auth, tema, quest do dia
- **Realtime**: subscriptions do Supabase em `useEffect` com cleanup ao desmontar
- ❌ Redux (overhead desnecessário pra esse escopo)

### CSS separado do JSX
- Estilos em arquivo próprio (`src/styles/` ou `Componente.css`), nunca style inline extenso no JSX.

### Env vars
- Só `import.meta.env.VITE_*` no front (Vite expõe só o prefixo `VITE_`).
- **Nunca** `service_role` no cliente — só a chave `anon`.

## Padrões de Backend (Supabase)

### RLS primeiro
- Isolamento é **por usuário** (`auth.uid()`), não por tenant (single-tenant — ADR-010).
- Política padrão de tabela pessoal: `user_id = auth.uid()` para select/insert/update.
- Tabelas de conteúdo público (ex: `quests` publicadas) têm select liberado, escrita só service_role (Edge Function).

### Logs fire-and-forget
- Eventos de jogo (`quest.cumprida`, `streak.quebrado`, `carta.ganha`) são logados sem bloquear a UX.
- Log estruturado **sem** dado sensível (sem e-mail em claro, sem token).

### Reuso de regra pura em Edge Function (Deno)
- Toda escrita privilegiada (streak, carta, vida) roda em Edge Function `service_role` e reusa **as mesmas** funções puras testadas de `src/lib/dominio` via `supabase/functions/_shared/dominio.ts` — regra num lugar só (fonte única de verdade).
- Só reexportar pelo shim módulos **sem imports internos** (Deno exige extensão `.ts`; import sem extensão do app quebra o bundle). Hoje: `streak.ts`, `vidas.ts`, `tiktok.ts`, `datas.ts`.
- Regra que dependa de um módulo com import sem extensão (ex.: `cartas.ts` → `./tiktok`) é **composta dentro da função**, não reexportada.

✅ `export { processarDia } from '../../../src/lib/dominio/streak.ts'` (módulo-folha)
❌ reexportar `cartas.ts` pelo shim (puxa `./tiktok` sem extensão → Deno falha no deploy)

### Contagem agregada sem trazer linhas
- Total/estatística (nº de cartas da temporada, dias do mês) usa `select('*', { count: 'exact', head: true })` — devolve só o `count`, zero linhas trafegadas, zero dado pessoal.
- Muitos "TODO: serviço agregado do M4" na verdade já estão **desbloqueados** pela RLS existente (`cards_select_all` p/ catálogo público; `*_select_own` p/ dado do usuário): fecham com um serviço de leitura/contagem, sem backend novo. Fechados assim: calendário do streak (`buscarDiasCumpridos`, R3) e total da temporada (`contarCartasTemporada`, R4).

✅ `supabase.from('cards').select('*', { count: 'exact', head: true }).eq('temporada', t)`
❌ `select('id')` e depois `data.length` (traz N linhas só pra contar)

### Agregado público sobre dado com RLS por usuário
- Quando o cliente precisa de um agregado **entre usuários** (ranking, contagem nacional) mas a RLS isola por `auth.uid()`, a agregação **não** pode rodar no cliente. Padrão: **função `security definer`** com `set search_path = public`, que agrega e retorna só o **mínimo** (LGPD) — nunca `user_id`/e-mail. As tabelas-base mantêm a RLS; expõe-se só `grant execute` da função a `anon`/`authenticated`.
- Nunca abrir uma policy de SELECT alheio na tabela-base pra viabilizar ranking — isso vaza dado individual. A função definer é a fronteira.
- `limite` sempre com clamp server-side (`least(greatest(coalesce(l,50),1),200)`); opt-in **opt-out por padrão** quando expõe identidade (apelido). Ex.: `ranking_dias_provados` (R6).

✅ função definer retorna `(username, dias_provados)` só de `ranking_publico = true`
❌ `create policy ... on completions for select using (true)` pra contar dias alheios

## Padrões de UI/UX

### Estados obrigatórios
Toda tela renderiza: `loading` · `empty` · `error` · `success`.

### Feedback temporal
- **Sucesso** (CUMPRI): confirmação imediata + animação de carta, < 2s.
- **Erro**: banner + retry, permanece até ação.
- **Carregando**: skeleton; spinner só se latência > 100ms.

✅ CUMPRI → animação da carta caindo → toast "Dia {N} garantido"
❌ Pop-up de erro que some sozinho em 3s

---

## Padrões [DEPRECADO]

| Padrão | Razão | Data | Sucessor |
|---|---|---|---|
| _(nenhum ainda)_ | — | — | — |

## Checklist de Novo Padrão

- [ ] Validado em contexto real (produção ou review)
- [ ] Documentado aqui com exemplo ✅ e contraexemplo ❌
- [ ] Anti-padrão claro
- [ ] Se de segurança: escalado e aplicado imediatamente

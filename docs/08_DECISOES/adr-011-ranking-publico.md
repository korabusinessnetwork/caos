# ADR-011 — Ranking público: apelido opt-in, só dias provados

**Status**: Aceito
**Data**: 2026-08-02
**Decisores**: Matheus
**Supersede**: —
**Supersedido por**: —

---

## Contexto

O ranking nacional é um motor de retenção e status ("maiores do Caos"), mas o público inclui
**menores (16+)** → LGPD redobrada. Dois problemas se cruzam:

1. **Privacidade (LGPD):** expor sequência/atividade de alguém sem consentimento é dado pessoal
   sendo publicado. Não pode ser padrão ligado.
2. **Integridade (anti-cheese):** marcar CUMPRI é por honra (ADR-006, verificação sem vídeo). Um
   ranking por streak cru premiaria quem só clica CUMPRI sem fazer nada.
3. **Técnico:** a RLS isola dados por `auth.uid()` (ADR-010), então o cliente **não consegue**
   contar dados de outros usuários — a agregação precisa de um caminho no servidor.

## Decisão

**O ranking é público, mas por opt-in e só de dias provados.**

- **Métrica:** número de **dias provados** — CUMPRIs com link do TikTok (`completions.provado = true`).
  Streak não-provado **nunca** entra no ranking.
- **Consentimento:** o usuário só aparece se ligar `profiles.ranking_publico` — **opt-out por
  padrão** (`default false`). Desligar remove da lista na próxima leitura.
- **Minimização:** expõe apenas o **`@apelido`** (que o próprio usuário escolheu) e a **contagem**.
  Nunca `user_id`, e-mail ou qualquer outra coluna.
- **Isolamento preservado:** a agregação entre usuários roda numa **função `security definer`**
  (`ranking_dias_provados`, `set search_path = public`, `limite` com clamp), exposta ao cliente só
  via `grant execute`. As tabelas-base (`completions`, `streaks`) **mantêm a RLS** — nenhuma policy
  de leitura alheia é aberta.

## Alternativas Consideradas

- **Ranking por streak cru (todos, sem opt-in):** máximo engajamento, mas viola LGPD (exposição sem
  consentimento) e premia CUMPRI sem prova. **Descartado.**
- **View comum (não-definer):** com `security_invoker`, a RLS do `anon` bloquearia a agregação; sem
  ela, é uma definer view "implícita" que o advisor do Supabase sinaliza. **Descartado** em favor da
  função definer explícita e minimizada.
- **Abrir SELECT de `completions` para agregar no cliente:** vazaria atividade individual de todos.
  **Descartado** — a fronteira é a função, nunca a tabela.

## Consequências

- **Positivas:** ranking motivador sem vazar dado individual; premia prova real (reforça o loop
  filmar→postar→provar); RLS das tabelas intacta.
- **Trade-offs / risco monitorado:** a função agrega por request — a partir de ~10k usuários, migra
  para *materialized view* com refresh agendado (nota em `docs/01_ARQUITETURA/escalabilidade.md`).
  Desempate hoje é `dias_provados desc, username asc`; ranking semanal/temporada fica para o futuro.
- A reversão (ex.: mudar métrica ou tornar público sem opt-in) exige **novo ADR** que supersede este.

## Referências
- `specs/ranking-publico.md` (spec + resultado da review — Rodada 6)
- `supabase/migrations/20260802_ranking_publico.sql` · `supabase/schema.sql` (função + coluna)
- ADR-006 (verificação por honra / PROVADO) · ADR-010 (single-tenant, RLS por `auth.uid()`)
- `memory/patterns.md` ("agregado público sobre dado com RLS por usuário")
- `docs/11_SEGURANCA/` (minimização LGPD, público 16+)

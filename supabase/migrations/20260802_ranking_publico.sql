-- =============================================================================
-- 20260802_ranking_publico — leaderboard nacional de dias provados
-- =============================================================================
-- Espelha supabase/schema.sql. Decisão do dono (2026-08-02): apelido OPT-IN,
-- só DIAS PROVADOS (completions.provado = true). LGPD (público 16+):
--   · opt-out por padrão (ranking_publico default false);
--   · a função retorna só apelido + contagem de quem optou — sem user_id/e-mail;
--   · agregação entre usuários roda em função `security definer` (a RLS por
--     usuário de completions impede o cliente de contar dados alheios). As
--     tabelas-base mantêm a RLS; o cliente nunca lê `completions` de terceiros.
-- =============================================================================

-- 1) Flag de opt-in no perfil (opt-out por padrão).
alter table profiles
  add column if not exists ranking_publico boolean not null default false;

-- 2) Função agregada: top N por dias provados, só de quem optou.
--    security definer + search_path fixo (não confiar no search_path do caller).
--    Minimização: SELECT explícito de username + contagem, nada além disso.
create or replace function ranking_dias_provados(limite int default 50)
returns table (username text, dias_provados bigint)
language sql
stable
security definer
set search_path = public
as $$
  select p.username, count(c.id) as dias_provados
  from profiles p
  join completions c on c.user_id = p.id and c.provado = true
  where p.ranking_publico = true
  group by p.username
  order by dias_provados desc, p.username asc
  limit least(greatest(coalesce(limite, 50), 1), 200)
$$;

-- 3) Só a função é exposta ao cliente (execute); nenhuma tabela-base é aberta.
grant execute on function ranking_dias_provados(int) to anon, authenticated;

-- Índice pra agregação de dias provados não varrer a tabela inteira.
create index if not exists completions_provado_user_idx
  on completions (user_id) where provado = true;

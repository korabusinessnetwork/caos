-- =============================================================================
-- Caos Diário — schema de referência (fonte de verdade do banco)
-- =============================================================================
-- Convenções: SQL snake_case · migrations YYYYMMDD_descricao.sql em supabase/migrations/
-- Segurança: RLS OBRIGATÓRIA em toda tabela. Single-tenant (ADR-010):
--   isolamento POR USUÁRIO via auth.uid(), NÃO por tenant_id.
-- Este arquivo documenta o alvo do schema; as migrations são a verdade aplicada.
-- Migração inicial aplicada em supabase/migrations/20260724_init.sql (espelha
-- este arquivo). Lógica de servidor (triggers/Edge Functions) vem na fase M4.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles — dados públicos do usuário (1:1 com auth.users)
-- -----------------------------------------------------------------------------
create table if not exists profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  username         text unique not null,
  titulo           text,                      -- título por streak (ver app)
  ranking_publico  boolean not null default false, -- opt-in do ranking (LGPD)
  created_at       timestamptz not null default now()
);
-- ranking_publico: opt-in do usuário pra aparecer no ranking nacional (LGPD:
-- opt-out por padrão). Ver a função ranking_dias_provados() no fim do arquivo.
alter table profiles enable row level security;
-- SELECT público (perfil é compartilhável); escrita só do dono.
create policy profiles_select_all on profiles for select using (true);
create policy profiles_write_own  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_insert_own on profiles for insert with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- quests — banco de quests curadas (conteúdo público quando publicada)
-- -----------------------------------------------------------------------------
create table if not exists quests (
  id            uuid primary key default gen_random_uuid(),
  dia           integer unique,               -- N do #CaosDia{N} (null enquanto rascunho)
  titulo        text not null,
  comando       text not null,                -- comando de 1 linha
  regra         text not null,                -- a restrição que cria a dificuldade
  categoria     text not null,                -- social | performance | criativa | domestico | insana
  raridade_alvo text not null default 'comum',-- comum | rara | lendaria | secreta
  hashtag       text,                         -- ex: #CaosDia47
  carta_id      uuid,                         -- FK -> cards.id (a carta desta quest)
  status        text not null default 'rascunho', -- rascunho | aprovada | agendada | publicada
  curador       text,                         -- quem escreveu (Matheus/Guilherme/Macedo)
  publicada_em  date,                         -- data em que virou "a quest do dia"
  created_at    timestamptz not null default now()
);
alter table quests enable row level security;
-- Só quest publicada é visível ao cliente; escrita só via Edge Function (service_role).
create policy quests_select_publicada on quests for select using (status = 'publicada');

-- -----------------------------------------------------------------------------
-- cards — catálogo de cartas (arte por quest/temporada)
-- -----------------------------------------------------------------------------
create table if not exists cards (
  id          uuid primary key default gen_random_uuid(),
  quest_id    uuid references quests (id) on delete set null,
  nome        text not null,                  -- ex: "O Narrador"
  raridade    text not null,                  -- comum | rara | lendaria | secreta
  temporada   integer not null default 1,     -- temporadas de 90 dias
  arte_url    text,
  created_at  timestamptz not null default now()
);
alter table cards enable row level security;
create policy cards_select_all on cards for select using (true);

-- -----------------------------------------------------------------------------
-- completions — registro de "CUMPRI" (1 por usuário por quest)
-- -----------------------------------------------------------------------------
create table if not exists completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  quest_id     uuid not null references quests (id) on delete cascade,
  provado      boolean not null default false,-- true se colou link do TikTok
  tiktok_url   text,                          -- guardamos SÓ a URL (ADR-006)
  completed_at timestamptz not null default now(),
  unique (user_id, quest_id)                  -- idempotência do CUMPRI
);
alter table completions enable row level security;
create policy completions_select_own on completions for select using (auth.uid() = user_id);
create policy completions_insert_own on completions for insert with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- streaks — estado de sequência por usuário (1:1)
-- -----------------------------------------------------------------------------
create table if not exists streaks (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  atual         integer not null default 0,
  melhor        integer not null default 0,
  ultima_data   date,                          -- último dia com CUMPRI
  rollover_ate  date,                          -- último dia já fechado pela virada (idempotência)
  updated_at    timestamptz not null default now()
);
alter table streaks enable row level security;
create policy streaks_select_own on streaks for select using (auth.uid() = user_id);
create policy streaks_update_own on streaks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- lives — vidas do usuário (1 a cada 24h; ADR-005)
-- -----------------------------------------------------------------------------
create table if not exists lives (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  disponivel        boolean not null default true,
  recarrega_em      timestamptz,               -- quando a próxima vida fica disponível
  extras_comprados  integer not null default 0 -- vidas pagas (fase 2)
);
alter table lives enable row level security;
create policy lives_select_own on lives for select using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- user_cards — cartas que o usuário conquistou (álbum)
-- -----------------------------------------------------------------------------
create table if not exists user_cards (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  card_id    uuid not null references cards (id) on delete cascade,
  provado    boolean not null default false,   -- selo PROVADO
  ganha_em   timestamptz not null default now(),
  unique (user_id, card_id)
);
alter table user_cards enable row level security;
create policy user_cards_select_own on user_cards for select using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- fires — Fogo do Caos: streak em dupla (ADR-007) [ativa na fase 2]
-- -----------------------------------------------------------------------------
create table if not exists fires (
  id            uuid primary key default gen_random_uuid(),
  user_a        uuid not null references auth.users (id) on delete cascade,
  user_b        uuid not null references auth.users (id) on delete cascade,
  dias          integer not null default 0,     -- 7 normal / 30 azul / 90 branco 亡者
  aceso         boolean not null default true,
  ultima_data   date,
  created_at    timestamptz not null default now(),
  check (user_a <> user_b)
);
alter table fires enable row level security;
-- Cada parte da dupla enxerga o próprio fogo.
create policy fires_select_participant on fires for select using (auth.uid() = user_a or auth.uid() = user_b);

-- -----------------------------------------------------------------------------
-- push_subscriptions — inscrições de Web Push (os 4 toques diários; ADR-001)
-- -----------------------------------------------------------------------------
-- Minimização (LGPD): guardamos só o necessário pra entregar o push. Sem nome,
-- sem e-mail. O envio roda em Edge Function com service_role (bypassa RLS).
create table if not exists push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  endpoint    text not null unique,           -- endpoint único do navegador
  p256dh      text not null,                  -- chave pública da inscrição
  auth        text not null,                  -- segredo de autenticação da inscrição
  created_at  timestamptz not null default now()
);
alter table push_subscriptions enable row level security;
-- O dono gerencia as próprias inscrições; ninguém mais lê/escreve.
create policy push_subs_select_own on push_subscriptions for select using (auth.uid() = user_id);
create policy push_subs_insert_own on push_subscriptions for insert with check (auth.uid() = user_id);
create policy push_subs_update_own on push_subscriptions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy push_subs_delete_own on push_subscriptions for delete using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- FK adiada: quests.carta_id -> cards.id (cards é criada depois de quests)
-- -----------------------------------------------------------------------------
alter table quests
  add constraint quests_carta_fk
  foreign key (carta_id) references cards (id) on delete set null;

-- -----------------------------------------------------------------------------
-- ranking_dias_provados — leaderboard nacional (só dias provados, apelido opt-in)
-- -----------------------------------------------------------------------------
-- Decisão do dono (2026-08-02): expor top por DIAS PROVADOS, só de quem optou.
-- security definer + search_path fixo: agrega entre usuários (a RLS por usuário
-- de completions impede o cliente de contar dados alheios), mas retorna só
-- apelido + contagem de opt-ins — sem user_id/e-mail (minimização LGPD). As
-- tabelas-base seguem com RLS; só a função é exposta ao cliente.
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
grant execute on function ranking_dias_provados(int) to anon, authenticated;

-- =============================================================================
-- Notas de segurança (ver docs/11_SEGURANCA):
--  · Toda escrita privilegiada (publicar quest, conceder carta, calcular streak,
--    recarregar vida) roda em Edge Function com service_role — NUNCA no cliente.
--  · Cliente usa apenas a chave anon. Sem service_role no front.
--  · completions.unique(user_id, quest_id) garante idempotência do CUMPRI.
-- =============================================================================

-- =============================================================================
-- 20260724_init — migration inicial do Caos Diário
-- =============================================================================
-- Espelha supabase/schema.sql (fonte de verdade). Convenções: SQL snake_case.
-- Segurança: RLS OBRIGATÓRIA em toda tabela. Single-tenant (ADR-010):
--   isolamento POR USUÁRIO via auth.uid(), NÃO por tenant_id.
-- Escritas privilegiadas (publicar quest, conceder carta, calcular streak,
--   recarregar vida) rodam em Edge Function com service_role — nunca no cliente.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles — dados públicos do usuário (1:1 com auth.users)
-- -----------------------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null,
  titulo       text,
  created_at   timestamptz not null default now()
);
alter table profiles enable row level security;
create policy profiles_select_all on profiles for select using (true);
create policy profiles_write_own  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_insert_own on profiles for insert with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- quests — banco de quests curadas (conteúdo público quando publicada)
-- -----------------------------------------------------------------------------
create table if not exists quests (
  id            uuid primary key default gen_random_uuid(),
  dia           integer unique,
  titulo        text not null,
  comando       text not null,
  regra         text not null,
  categoria     text not null,
  raridade_alvo text not null default 'comum',
  hashtag       text,
  carta_id      uuid,
  status        text not null default 'rascunho',
  curador       text,
  publicada_em  date,
  created_at    timestamptz not null default now()
);
alter table quests enable row level security;
create policy quests_select_publicada on quests for select using (status = 'publicada');

-- -----------------------------------------------------------------------------
-- cards — catálogo de cartas (arte por quest/temporada)
-- -----------------------------------------------------------------------------
create table if not exists cards (
  id          uuid primary key default gen_random_uuid(),
  quest_id    uuid references quests (id) on delete set null,
  nome        text not null,
  raridade    text not null,
  temporada   integer not null default 1,
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
  provado      boolean not null default false,
  tiktok_url   text,
  completed_at timestamptz not null default now(),
  unique (user_id, quest_id)
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
  ultima_data   date,
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
  recarrega_em      timestamptz,
  extras_comprados  integer not null default 0
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
  provado    boolean not null default false,
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
  dias          integer not null default 0,
  aceso         boolean not null default true,
  ultima_data   date,
  created_at    timestamptz not null default now(),
  check (user_a <> user_b)
);
alter table fires enable row level security;
create policy fires_select_participant on fires for select using (auth.uid() = user_a or auth.uid() = user_b);

-- -----------------------------------------------------------------------------
-- FK adiada: quests.carta_id -> cards.id (cards é criada depois de quests)
-- -----------------------------------------------------------------------------
alter table quests
  add constraint quests_carta_fk
  foreign key (carta_id) references cards (id) on delete set null;

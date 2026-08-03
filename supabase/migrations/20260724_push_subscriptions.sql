-- =============================================================================
-- 20260724_push_subscriptions — inscrições de Web Push (os 4 toques diários)
-- =============================================================================
-- Espelha supabase/schema.sql. ADR-001 (Web Push nativo = custo R$0).
-- Minimização (LGPD): só o necessário pra entregar o push (sem nome/e-mail).
-- Envio dos toques roda em Edge Function com service_role (bypassa RLS).
-- =============================================================================

create table if not exists push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy push_subs_select_own on push_subscriptions
  for select using (auth.uid() = user_id);
create policy push_subs_insert_own on push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy push_subs_update_own on push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy push_subs_delete_own on push_subscriptions
  for delete using (auth.uid() = user_id);

-- Índice pro envio em lote varrer inscrições por usuário sem full scan.
create index if not exists push_subscriptions_user_idx
  on push_subscriptions (user_id);

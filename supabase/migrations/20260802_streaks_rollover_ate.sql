-- =============================================================================
-- 20260802_streaks_rollover_ate — idempotência da virada do dia (fechar-o-dia)
-- =============================================================================
-- Espelha supabase/schema.sql. ADR-005 (vidas/streak recalculados na virada).
-- `rollover_ate` = último "dia do caos" (data SP) já contabilizado pela Edge
-- Function fechar-o-dia. Barra a 2ª execução do mesmo dia (não penaliza 2×).
-- Escrita é service_role (bypassa RLS); o cliente nem lê esta coluna → sem
-- mudança de policy. Coluna nullable, aditiva, sem reescrever dado existente.
-- =============================================================================

alter table streaks
  add column if not exists rollover_ate date;

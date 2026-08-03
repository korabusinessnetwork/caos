/**
 * Serviço de streak — leitura do estado de sequência do usuário (streaks).
 *
 * O CÁLCULO da virada (streak +1, vida absorve, streak zera) é lógica pura em
 * dominio/streak.ts e é aplicado no servidor (M4) a partir de completions —
 * o cliente nunca reescreve o próprio streak à mão. Aqui só lemos o estado.
 */
import { supabase } from './supabase';
import type { EstadoStreak } from './tipos';

const CAMPOS_STREAK = 'atual, melhor, ultima_data';

const ESTADO_INICIAL: EstadoStreak = { atual: 0, melhor: 0, ultimaData: null };

/** Estado de streak do usuário atual. Sem linha ainda → estado inicial. */
export async function buscarStreak(): Promise<EstadoStreak> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada. Entre novamente.');

  const { data, error } = await supabase
    .from('streaks')
    .select(CAMPOS_STREAK)
    .eq('user_id', auth.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { ...ESTADO_INICIAL };

  return {
    atual: data.atual,
    melhor: data.melhor,
    ultimaData: data.ultima_data,
  };
}

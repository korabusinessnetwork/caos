/**
 * Serviço de streak — leitura do estado de sequência do usuário (streaks).
 *
 * O CÁLCULO da virada (streak +1, vida absorve, streak zera) é lógica pura em
 * dominio/streak.ts e é aplicado no servidor (M4) a partir de completions —
 * o cliente nunca reescreve o próprio streak à mão. Aqui só lemos o estado.
 */
import { supabase } from './supabase';
import { partesEmSP } from './dominio/datas';
import type { EstadoStreak } from './tipos';

const CAMPOS_STREAK = 'atual, melhor, ultima_data';

// SP = UTC−3 fixo (sem horário de verão desde 2019, ver dominio/datas.ts):
// 00:00 em SP corresponde a 03:00 UTC. Usado para ancorar o mês do calendário.
const OFFSET_SP_HORAS = 3;

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

/**
 * Dias-do-mês (1..31, fuso SP) em que o usuário marcou CUMPRI no mês pedido —
 * alimenta a grade do calendário do streak. Lê só as próprias `completions`
 * (RLS por `auth.uid()` + filtro explícito), campos explícitos. O intervalo é
 * ancorado em SP (00:00 SP = 03:00 UTC) e o dia da célula vem de `partesEmSP`
 * (data-calendário do caos, ADR-002), não do dia UTC cru.
 *
 * @param ano ano com 4 dígitos (ex.: 2026)
 * @param mes mês 1..12
 */
export async function buscarDiasCumpridos(
  ano: number,
  mes: number,
): Promise<number[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada. Entre novamente.');

  const inicioUtc = new Date(Date.UTC(ano, mes - 1, 1, OFFSET_SP_HORAS));
  const fimUtc = new Date(Date.UTC(ano, mes, 1, OFFSET_SP_HORAS));

  const { data, error } = await supabase
    .from('completions')
    .select('completed_at')
    .eq('user_id', auth.user.id)
    .gte('completed_at', inicioUtc.toISOString())
    .lt('completed_at', fimUtc.toISOString());

  if (error) throw new Error(error.message);
  if (!data) return [];

  const dias = new Set<number>();
  for (const linha of data as { completed_at: string }[]) {
    dias.add(partesEmSP(new Date(linha.completed_at)).dia);
  }
  return [...dias];
}

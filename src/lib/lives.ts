/**
 * Serviço de vidas — leitura do estado de vidas do usuário (lives).
 *
 * A recarga (1 vida a cada 24h) é lógica pura em dominio/vidas.ts e é aplicada
 * no servidor (M4). Aqui só lemos o estado para a UI mostrar vida cheia/vazia
 * e o countdown de recarga.
 */
import { supabase } from './supabase';
import type { EstadoVidas } from './tipos';

const CAMPOS_VIDAS = 'disponivel, recarrega_em, extras_comprados';

const ESTADO_INICIAL: EstadoVidas = {
  disponivel: true,
  recarregaEm: null,
  extrasComprados: 0,
};

/** Estado de vidas do usuário atual. Sem linha ainda → 1 vida disponível. */
export async function buscarVidas(): Promise<EstadoVidas> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada. Entre novamente.');

  const { data, error } = await supabase
    .from('lives')
    .select(CAMPOS_VIDAS)
    .eq('user_id', auth.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { ...ESTADO_INICIAL };

  return {
    disponivel: data.disponivel,
    recarregaEm: data.recarrega_em,
    extrasComprados: data.extras_comprados,
  };
}

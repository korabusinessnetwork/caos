/**
 * Serviço de perfil — dados públicos do usuário (profiles).
 *
 * Campos explícitos, nunca select *. O título é derivado do streak no cliente
 * (dominio/streak.tituloPorStreak) e também guardado aqui pelo servidor; a UI
 * usa o do streak como fonte viva.
 */
import { supabase } from './supabase';
import type { Perfil } from './tipos';

const CAMPOS_PERFIL = 'id, username, titulo, created_at';

/** Perfil do usuário atual. Sem linha ainda → null (perfil é criado no cadastro). */
export async function buscarPerfil(): Promise<Perfil | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada. Entre novamente.');

  const { data, error } = await supabase
    .from('profiles')
    .select(CAMPOS_PERFIL)
    .eq('id', auth.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    username: data.username,
    titulo: data.titulo,
    createdAt: data.created_at,
  };
}

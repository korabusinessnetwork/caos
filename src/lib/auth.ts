/**
 * Serviço de autenticação — único ponto que fala com supabase.auth.
 * Componentes NUNCA chamam supabase direto (arquitetura §camada de serviços).
 *
 * Segurança: nunca logamos e-mail/senha/token. Erros do backend viram Error
 * com mensagem neutra (a UI decide o texto humano — princípio nº1).
 */
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Credenciais {
  email: string;
  senha: string;
}

/** Login com e-mail/senha. Lança em falha; devolve a sessão em sucesso. */
export async function entrarComEmail({ email, senha }: Credenciais): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });
  if (error || !data.session) {
    throw new Error(error?.message ?? 'Falha ao entrar.');
  }
  return data.session;
}

/** Cadastro com e-mail/senha. Pode exigir confirmação por e-mail (session null). */
export async function cadastrarComEmail({
  email,
  senha,
}: Credenciais): Promise<{ user: User | null; session: Session | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { user: data.user, session: data.session };
}

/** Encerra a sessão local. */
export async function sair(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** Sessão atual (ou null se deslogado). */
export async function sessaoAtual(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

/** Usuário atual autenticado (revalida no servidor). */
export async function usuarioAtual(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null; // sem sessão válida
  return data.user;
}

/**
 * Assina mudanças de auth (login/logout/refresh). Retorna a função que
 * cancela a inscrição — chame no cleanup do efeito.
 */
export function aoMudarAuth(
  callback: (evento: AuthChangeEvent, sessao: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}

/**
 * Exclusão de conta (LGPD — público inclui menores). Apagar o usuário de
 * auth.users exige service_role, então roda numa Edge Function dedicada.
 * A função `excluir-conta` é implementada na fase de Edge Functions (M4).
 */
export async function excluirConta(): Promise<void> {
  const { error } = await supabase.functions.invoke('excluir-conta');
  if (error) throw new Error(error.message);
  await supabase.auth.signOut();
}

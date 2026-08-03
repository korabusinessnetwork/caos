import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Único ponto que instancia o cliente Supabase.
 * Só a chave ANON (pública) — a `service_role` JAMAIS vai para o front (ADR-001).
 * Nenhum componente importa isto direto: acesso sempre via módulos de serviço.
 *
 * O import NUNCA lança: se faltar env, `supabaseConfigurado` fica false e a UI
 * degrada com um estado visível (princípio nº1: nunca tela em branco). O erro
 * só estoura se alguém tentar de fato usar o cliente sem configuração.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && anon);

const clienteNaoConfigurado = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error(
      'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local.',
    );
  },
});

export const supabase: SupabaseClient = supabaseConfigurado
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : clienteNaoConfigurado;

// =============================================================================
// excluir-conta — exclusão de conta e dados pessoais (LGPD; público inclui 16+)
// =============================================================================
// Chamada pelo cliente (supabase.functions.invoke) com o JWT do próprio usuário.
// O usuário só pode excluir A SI MESMO: verificamos o JWT no servidor e usamos
// o service_role SÓ pra apagar. Deletar de auth.users cascateia (ON DELETE
// CASCADE) para profiles, completions, streaks, lives, user_cards, fires e
// push_subscriptions — purga total, sem sobra de dado pessoal.
//
// Segredos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY.
// =============================================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const autorizacao = req.headers.get('Authorization');
  if (!autorizacao) return json({ erro: 'Sem sessão.' }, 401);

  // Cliente "como o usuário": valida o JWT e devolve QUEM é (server-side).
  const comoUsuario = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: autorizacao } } },
  );
  const { data: userData, error: erroUser } = await comoUsuario.auth.getUser();
  if (erroUser || !userData.user) {
    return json({ erro: 'Sessão inválida.' }, 401);
  }
  const userId = userData.user.id;

  // Cliente admin (service_role) — só pra apagar. Nunca exposto ao front.
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    // Não vaza detalhe técnico; não logamos id/e-mail.
    return json({ erro: 'Não deu pra excluir agora. Tente de novo.' }, 500);
  }

  return json({ status: 'excluida' });
});

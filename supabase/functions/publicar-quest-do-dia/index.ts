// =============================================================================
// publicar-quest-do-dia — promove a quest do dia às 7h (America/Sao_Paulo)
// =============================================================================
// Roda no servidor com service_role (só ele escreve em quests — RLS do cliente
// é só SELECT de publicada). Acionada por cron 7h com x-cron-secret.
//
// Regra de publicação (mecanismo que o schema implica; a CURADORIA é do dono):
//   pega a quest 'agendada' de menor `dia` ainda não publicada; se não houver,
//   cai pra 'aprovada' de menor `dia`. Marca status='publicada', publicada_em=hoje
//   e garante hashtag #CaosDia{dia}. Idempotente: se já há publicada hoje, no-op.
//
// Segredos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET.
// =============================================================================

import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SECRET');
  if (!segredo || req.headers.get('x-cron-secret') !== segredo) {
    return new Response('Não autorizado.', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const hoje = new Date().toISOString().slice(0, 10);

  // Idempotência: já publicou hoje? Não faz de novo.
  const { data: jaPublicada } = await supabase
    .from('quests')
    .select('id, dia')
    .eq('status', 'publicada')
    .eq('publicada_em', hoje)
    .maybeSingle();
  if (jaPublicada) {
    return new Response(
      JSON.stringify({ status: 'ja-publicada', dia: jaPublicada.dia }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Escolhe a próxima: 'agendada' de menor dia; senão 'aprovada' de menor dia.
  const escolher = async (status: string) => {
    const { data } = await supabase
      .from('quests')
      .select('id, dia, hashtag')
      .eq('status', status)
      .not('dia', 'is', null)
      .order('dia', { ascending: true })
      .limit(1)
      .maybeSingle();
    return data;
  };

  const proxima = (await escolher('agendada')) ?? (await escolher('aprovada'));
  if (!proxima) {
    return new Response(
      JSON.stringify({ status: 'sem-quest', hoje }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const hashtag = proxima.hashtag ?? `#CaosDia${proxima.dia}`;
  const { error } = await supabase
    .from('quests')
    .update({ status: 'publicada', publicada_em: hoje, hashtag })
    .eq('id', proxima.id);
  if (error) return new Response('Erro ao publicar.', { status: 500 });

  return new Response(
    JSON.stringify({ status: 'publicada', dia: proxima.dia, hashtag }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});

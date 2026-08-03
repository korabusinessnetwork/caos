// =============================================================================
// enviar-toque — dispara um dos 4 toques diários de Web Push (7h/12h/20h/22h)
// =============================================================================
// Roda no servidor com service_role (bypassa RLS pra ler inscrições de todos).
// Acionada por cron (pg_cron → pg_net) com o header x-cron-secret. NUNCA é
// chamada pelo cliente. Custo R$0 (Web Push nativo, ADR-001).
//
// Segredos (supabase secrets set ...): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, CRON_SECRET.
//
// Escala: a 10k usuários, varrer as inscrições em memória é suficiente. A 1M,
// isto vira worker paginado/fila (ver docs de escalabilidade) — projeção, não v1.
// =============================================================================

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

type Toque = 'manha' | 'meio-dia' | 'noite' | 'ultima';

// Copy dos toques: emoção sobre informação (princípio nº1). O da noite cobra o
// Fogo do Caos (20h cobra o parceiro — ADR-007).
const COPY: Record<Toque, { titulo: string; corpo: string }> = {
  manha: {
    titulo: 'A quest de hoje caiu 🔥',
    corpo: 'O Brasil todo no mesmo caos. Bora?',
  },
  'meio-dia': {
    titulo: 'Ainda dá tempo',
    corpo: 'O caos de hoje não vai se cumprir sozinho.',
  },
  noite: {
    titulo: 'Não deixa o fogo apagar',
    corpo: 'Seu parceiro tá contando com você. Cumpre o caos.',
  },
  ultima: {
    titulo: 'Última chamada',
    corpo: 'Faltam poucas horas. Não quebra seu streak agora.',
  },
};

function ehToque(v: unknown): v is Toque {
  return v === 'manha' || v === 'meio-dia' || v === 'noite' || v === 'ultima';
}

Deno.serve(async (req) => {
  // Só cron autorizado dispara (segredo compartilhado, nunca no cliente).
  const segredo = Deno.env.get('CRON_SECRET');
  if (!segredo || req.headers.get('x-cron-secret') !== segredo) {
    return new Response('Não autorizado.', { status: 401 });
  }

  // Qual toque? (body JSON { toque } ou ?toque=)
  let toque: unknown;
  try {
    const body = await req.json();
    toque = body?.toque;
  } catch {
    toque = new URL(req.url).searchParams.get('toque');
  }
  if (!ehToque(toque)) {
    return new Response('Toque inválido.', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  webpush.setVapidDetails(
    Deno.env.get('VAPID_SUBJECT') ?? 'mailto:caos@exemplo.com',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!,
  );

  // Quest publicada de hoje (pra o link do push e pra saber quem já cumpriu).
  const hoje = new Date().toISOString().slice(0, 10);
  const { data: quest } = await supabase
    .from('quests')
    .select('id')
    .eq('status', 'publicada')
    .eq('publicada_em', hoje)
    .maybeSingle();

  // Todas as inscrições (a 10k, cabe em memória).
  const { data: inscricoes, error: erroInscr } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth');
  if (erroInscr) return new Response('Erro ao ler inscrições.', { status: 500 });

  // Toques que não o da manhã só vão pra quem AINDA não cumpriu (não spam).
  let jaCumpriram = new Set<string>();
  if (toque !== 'manha' && quest?.id) {
    const { data: comps } = await supabase
      .from('completions')
      .select('user_id')
      .eq('quest_id', quest.id);
    jaCumpriram = new Set((comps ?? []).map((c) => c.user_id));
  }

  const alvos = (inscricoes ?? []).filter(
    (s) => toque === 'manha' || !jaCumpriram.has(s.user_id),
  );

  const payload = JSON.stringify({
    titulo: COPY[toque].titulo,
    corpo: COPY[toque].corpo,
    tag: `caos-${toque}`,
    url: '/?fonte=push',
  });

  let enviados = 0;
  const expiradas: string[] = [];
  await Promise.all(
    alvos.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        );
        enviados++;
      } catch (e) {
        // 404/410 = inscrição morta → limpa. Nunca logamos o endpoint (dado pessoal).
        const status = (e as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) expiradas.push(s.id);
      }
    }),
  );

  if (expiradas.length > 0) {
    await supabase.from('push_subscriptions').delete().in('id', expiradas);
  }

  return new Response(
    JSON.stringify({ toque, enviados, limpas: expiradas.length }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});

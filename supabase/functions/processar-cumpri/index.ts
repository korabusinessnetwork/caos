// =============================================================================
// processar-cumpri — o CUMPRI autoritativo (deriva streak + concede a carta)
// =============================================================================
// Fonte ÚNICA de verdade do efeito colateral do CUMPRI. O cliente só DIZ "cumpri
// a quest de hoje (+ link opcional)"; QUEM grava streak/carta é aqui, com
// service_role — porque a RLS PROÍBE o cliente de escrever em streaks (só
// UPDATE), user_cards e lives (só SELECT). Cliente adulterado não forja status.
//
// Regra (reusa o kernel puro testado em src/lib/dominio via _shared/dominio.ts):
//   1. valida sessão (JWT do próprio usuário) e o link de TikTok;
//   2. exige que a quest seja A PUBLICADA DE HOJE (anti-inflar streak com quest
//      antiga);
//   3. idempotente: se já cumpriu, devolve o estado sem re-conceder;
//   4. streak: processarDia(cumpriu=true) sobre a base (continua se ontem;
//      senão recomeça em 1) — a "absorção por vida" é da virada do dia (cron
//      futuro), não do CUMPRI;
//   5. concede a carta do dia (quests.carta_id), com selo PROVADO se houve link.
//
// Fogo do Caos (fires) é fase 2 (ADR-007) — marcado abaixo, não implementado.
//
// Segredos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY.
// =============================================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';
import { chaveDiaCaos, ehUrlTikTokValida, processarDia } from '../_shared/dominio.ts';

const UM_DIA_MS = 24 * 60 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ erro: 'Método não permitido.' }, 405);

  // 1a. Sessão: valida o JWT e descobre QUEM é (server-side, não confia no body).
  const autorizacao = req.headers.get('Authorization');
  if (!autorizacao) return json({ erro: 'Entre pra marcar CUMPRI.' }, 401);

  const comoUsuario = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: autorizacao } } },
  );
  const { data: userData, error: erroUser } = await comoUsuario.auth.getUser();
  if (erroUser || !userData.user) return json({ erro: 'Sessão inválida.' }, 401);
  const userId = userData.user.id;

  // 1b. Entrada: questId obrigatório; link de TikTok validado (mesma regra pura).
  let corpo: { questId?: unknown; tiktokUrl?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: 'Requisição inválida.' }, 400);
  }
  const questId = typeof corpo.questId === 'string' ? corpo.questId : '';
  if (!questId) return json({ erro: 'Quest não informada.' }, 400);

  const urlBruta = typeof corpo.tiktokUrl === 'string' ? corpo.tiktokUrl.trim() : '';
  const tiktokUrl = urlBruta || null;
  if (tiktokUrl !== null && !ehUrlTikTokValida(tiktokUrl)) {
    return json({ erro: 'Link de TikTok inválido.' }, 400);
  }
  const provado = tiktokUrl !== null;

  // Cliente admin (service_role) — o único que escreve streak/carta. Nunca no front.
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const agora = new Date();
  const hoje = chaveDiaCaos(agora);

  // 2. Só a quest publicada de HOJE pode ser cumprida (anti-inflar streak).
  const { data: questHoje, error: erroQuest } = await admin
    .from('quests')
    .select('id, carta_id')
    .eq('status', 'publicada')
    .eq('publicada_em', hoje)
    .maybeSingle();
  if (erroQuest) return json({ erro: 'O caos travou. Tenta de novo.' }, 500);
  if (!questHoje) return json({ erro: 'A quest de hoje ainda não caiu.' }, 409);
  if (questHoje.id !== questId) return json({ erro: 'Essa não é a quest de hoje.' }, 409);

  // 3. Idempotência: já cumpriu? Devolve o estado, sem re-conceder carta/streak.
  const { data: jaComp } = await admin
    .from('completions')
    .select('id, provado')
    .eq('user_id', userId)
    .eq('quest_id', questId)
    .maybeSingle();
  if (jaComp) {
    const { data: s } = await admin
      .from('streaks')
      .select('atual, melhor')
      .eq('user_id', userId)
      .maybeSingle();
    return json({
      status: 'ja-cumprido',
      provado: jaComp.provado,
      streak: s?.atual ?? 0,
      melhor: s?.melhor ?? 0,
      ganhouCarta: false,
      carta: null,
    });
  }

  // Registra o fato "cumpriu". unique(user_id, quest_id) trava corrida (23505).
  const { error: erroComp } = await admin
    .from('completions')
    .insert({ user_id: userId, quest_id: questId, provado, tiktok_url: tiktokUrl });
  if (erroComp) {
    // Corrida: outra chamada gravou primeiro → trata como já-cumprido (não dobra).
    if ((erroComp as { code?: string }).code === '23505') {
      const { data: s } = await admin
        .from('streaks')
        .select('atual, melhor')
        .eq('user_id', userId)
        .maybeSingle();
      return json({
        status: 'ja-cumprido',
        provado,
        streak: s?.atual ?? 0,
        melhor: s?.melhor ?? 0,
        ganhouCarta: false,
        carta: null,
      });
    }
    return json({ erro: 'Não deu pra registrar o CUMPRI. Tenta de novo.' }, 500);
  }

  // 4. Streak: regra pura (cumpriu=true). Continua se ontem tinha CUMPRI; senão,
  //    recomeça em 1. A absorção por vida é da virada do dia (cron futuro).
  const { data: streakRow } = await admin
    .from('streaks')
    .select('atual, melhor, ultima_data')
    .eq('user_id', userId)
    .maybeSingle();

  const ontem = chaveDiaCaos(new Date(agora.getTime() - UM_DIA_MS));
  const base = streakRow?.ultima_data === ontem ? (streakRow?.atual ?? 0) : 0;
  const res = processarDia({ streak: base, vidas: 0 }, true);
  const novoAtual = res.streak;
  const novoMelhor = Math.max(streakRow?.melhor ?? 0, novoAtual);

  const { error: erroStreak } = await admin.from('streaks').upsert(
    {
      user_id: userId,
      atual: novoAtual,
      melhor: novoMelhor,
      ultima_data: hoje,
      updated_at: agora.toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (erroStreak) {
    // O CUMPRI já está registrado; só o estado derivado falhou. Não vaza detalhe.
    return json({ erro: 'CUMPRI registrado, mas o streak não atualizou. Recarrega.' }, 500);
  }

  // 5. Carta do dia (quests.carta_id). Idempotente por unique(user_id, card_id).
  let carta:
    | { nome: string; raridade: string; temporada: number; arteUrl: string | null; provado: boolean }
    | null = null;
  if (res.ganhouCarta && questHoje.carta_id) {
    const { data: card } = await admin
      .from('cards')
      .select('id, nome, raridade, temporada, arte_url')
      .eq('id', questHoje.carta_id)
      .maybeSingle();
    if (card) {
      await admin
        .from('user_cards')
        .upsert(
          { user_id: userId, card_id: card.id, provado },
          { onConflict: 'user_id,card_id', ignoreDuplicates: true },
        );
      carta = {
        nome: card.nome,
        raridade: card.raridade,
        temporada: card.temporada,
        arteUrl: card.arte_url ?? null,
        provado,
      };
    }
  }

  // 6. Fogo do Caos (fires) — fase 2 (ADR-007): acender/cobrar o parceiro. TODO.

  return json({
    status: 'cumprido',
    provado,
    streak: novoAtual,
    melhor: novoMelhor,
    ganhouCarta: carta !== null,
    carta,
  });
});

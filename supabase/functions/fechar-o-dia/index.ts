// =============================================================================
// fechar-o-dia — a virada do dia (aplica a falta + recarrega vidas) · ADR-005
// =============================================================================
// Roda no servidor com service_role (a RLS PROÍBE o cliente de escrever streaks
// e lives). Acionada por cron logo após a meia-noite SP, com x-cron-secret.
// NUNCA é chamada pelo cliente. Custo R$0 (Supabase free + pg_cron/pg_net).
//
// O que faz para o dia que fechou (diaFechado, data-calendário SP):
//   A) FALTA — quem tinha streak e NÃO cumpriu a quest do dia: vida absorve
//      (streak vive, sem carta) ou streak zera (sem vida). Regra pura testada
//      processarDia(cumpriu=false). Complementa o processar-cumpri (que só soma).
//   B) RECARGA — 1 vida a cada 24h (capacidade 1 na v1), regra pura recarregarVidas.
//
// Idempotente por dia: streaks.rollover_ate barra a 2ª execução do mesmo dia.
// Cada usuário processado recebe rollover_ate=diaFechado e SAI do filtro — por
// isso o laço "busca-até-esvaziar" é seguro mesmo mutando enquanto varre.
//
// Escala: a 10k, varrer em páginas de 1000 basta. A 1M vira job paginado por
// fila (ver docs/01_ARQUITETURA/escalabilidade.md) — projeção, não v1.
//
// Segredos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET.
// =============================================================================

import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  chaveDiaCaos,
  processarDia,
  recarregarVidas,
  VIDAS_INTERVALO_MS,
  type EstadoVidas,
} from '../_shared/dominio.ts';

const PAGINA = 1000;

interface LinhaLives {
  user_id: string;
  disponivel: boolean;
  recarrega_em: string | null;
}

/** Linha de lives (ou ausência) → estado puro de vidas. Ausente = 1 vida (paridade com o cliente). */
function lerVidas(linha: LinhaLives | undefined, agoraMs: number): EstadoVidas {
  const disponivel = linha ? linha.disponivel : true;
  const recarregaEm = linha ? linha.recarrega_em : null;
  const vidas = disponivel ? 1 : 0;
  return {
    vidas,
    capacidade: 1, // v1: 1 vida-base. Extras (fase 2/ADR-008) elevam a capacidade.
    // Cheia → âncora no presente. Vazia → âncora = próxima recarga − 24h.
    recargaAncora: disponivel
      ? agoraMs
      : recarregaEm
        ? new Date(recarregaEm).getTime() - VIDAS_INTERVALO_MS
        : agoraMs,
  };
}

/** Estado puro de vidas → colunas do banco (capacidade 1). */
function gravarVidas(vidas: number, ancoraMs: number): { disponivel: boolean; recarrega_em: string | null } {
  const disponivel = vidas >= 1;
  return {
    disponivel,
    recarrega_em: disponivel ? null : new Date(ancoraMs + VIDAS_INTERVALO_MS).toISOString(),
  };
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SECRET');
  if (!segredo || req.headers.get('x-cron-secret') !== segredo) {
    return new Response('Não autorizado.', { status: 401 });
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const agora = new Date();
  const agoraMs = agora.getTime();
  const agoraIso = agora.toISOString();
  // O dia que fechou é o de ONTEM em SP (rollover roda logo após a meia-noite).
  const diaFechado = chaveDiaCaos(new Date(agoraMs - VIDAS_INTERVALO_MS));

  let faltas = 0;
  let zerados = 0;
  let recargas = 0;

  // ---------------------------------------------------------------------------
  // Passo A — FALTA. Candidato: tinha streak e não cumpriu diaFechado, ainda não
  // contabilizado. Aplica processarDia(false) sobre a vida ATUAL (falta-antes-de-
  // recarga: uma vida NÃO recarrega a tempo de absorver a falta do mesmo dia — se
  // recarregasse, com rollover diário o streak nunca morreria, contra o ADR-005).
  // A recarga de quem faltou fica pro Passo B. Marca rollover_ate=diaFechado → sai
  // do filtro (idempotência).
  // ---------------------------------------------------------------------------
  for (;;) {
    const { data: pagina, error: erroStreaks } = await admin
      .from('streaks')
      .select('user_id, atual, melhor')
      .gt('atual', 0)
      .lt('ultima_data', diaFechado)
      .or(`rollover_ate.is.null,rollover_ate.lt.${diaFechado}`)
      .order('user_id')
      .limit(PAGINA);
    if (erroStreaks) return new Response('Erro ao ler streaks.', { status: 500 });
    if (!pagina || pagina.length === 0) break;

    const ids = pagina.map((s) => s.user_id);
    const { data: livesPagina, error: erroLives } = await admin
      .from('lives')
      .select('user_id, disponivel, recarrega_em')
      .in('user_id', ids);
    if (erroLives) return new Response('Erro ao ler lives.', { status: 500 });

    const mapaLives = new Map<string, LinhaLives>(
      (livesPagina ?? []).map((l) => [l.user_id, l as LinhaLives]),
    );

    const updatesStreaks: Array<Record<string, unknown>> = [];
    const updatesLives: Array<Record<string, unknown>> = [];

    for (const s of pagina) {
      const estado = lerVidas(mapaLives.get(s.user_id), agoraMs);
      const dia = processarDia({ streak: s.atual, vidas: estado.vidas }, false);

      updatesStreaks.push({
        user_id: s.user_id,
        atual: dia.streak,
        melhor: s.melhor, // a falta nunca sobe o recorde
        rollover_ate: diaFechado,
        updated_at: agoraIso,
      });

      // Só mexe em lives quando a vida ABSORVEU a falta: esvazia e inicia a
      // recarga de 24h. Sem consumo (zerou ou já 0), a recarga é do Passo B.
      if (dia.vidaConsumida) {
        updatesLives.push({ user_id: s.user_id, ...gravarVidas(0, agoraMs) });
      }

      faltas++;
      if (dia.streakZerou) zerados++;
    }

    const { error: erroUpStreaks } = await admin
      .from('streaks')
      .upsert(updatesStreaks, { onConflict: 'user_id' });
    if (erroUpStreaks) return new Response('Erro ao gravar streaks.', { status: 500 });

    if (updatesLives.length > 0) {
      const { error: erroUpLives } = await admin
        .from('lives')
        .upsert(updatesLives, { onConflict: 'user_id' });
      if (erroUpLives) return new Response('Erro ao gravar lives.', { status: 500 });
    }
  }

  // ---------------------------------------------------------------------------
  // Passo B — RECARGA de quem NÃO faltou (cumpriu mas tinha vida gasta pendente).
  // Quem faltou já teve a vida tratada no passo A. Recarregado → sai do filtro.
  // ---------------------------------------------------------------------------
  for (;;) {
    const { data: pagina, error: erroPend } = await admin
      .from('lives')
      .select('user_id, disponivel, recarrega_em')
      .eq('disponivel', false)
      .lte('recarrega_em', agoraIso)
      .order('user_id')
      .limit(PAGINA);
    if (erroPend) return new Response('Erro ao ler recargas.', { status: 500 });
    if (!pagina || pagina.length === 0) break;

    const updatesLives: Array<Record<string, unknown>> = [];
    for (const l of pagina) {
      const rec = recarregarVidas(lerVidas(l as LinhaLives, agoraMs), agoraMs);
      updatesLives.push({ user_id: l.user_id, ...gravarVidas(rec.vidas, rec.recargaAncora) });
      recargas++;
    }

    const { error: erroUp } = await admin
      .from('lives')
      .upsert(updatesLives, { onConflict: 'user_id' });
    if (erroUp) return new Response('Erro ao gravar recargas.', { status: 500 });
  }

  // Fogo do Caos (fires) — fase 2 (ADR-007): apagar o fogo de quem faltou. TODO.

  return new Response(
    JSON.stringify({ diaFechado, processados: faltas, faltas, zerados, recargas }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});

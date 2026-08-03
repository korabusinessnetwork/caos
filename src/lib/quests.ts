/**
 * Serviço de quests — a quest do dia, o arquivo e o ato de marcar CUMPRI.
 *
 * Regras aplicadas aqui:
 *  · Só quest publicada é visível (RLS já garante; consultamos por data).
 *  · A URL de TikTok colada é VALIDADA antes de qualquer escrita (CLAUDE.md).
 *  · CUMPRI é idempotente: completions tem unique(user_id, quest_id).
 *  · Campos explícitos, nunca select * (dado de usuário em completions).
 */
import { supabase } from './supabase';
import { ehUrlTikTokValida } from './dominio/tiktok';
import type { Quest, Raridade, ResultadoCumpri } from './tipos';

const CAMPOS_QUEST =
  'id, dia, titulo, comando, regra, categoria, raridade_alvo, hashtag, publicada_em';

interface LinhaQuest {
  id: string;
  dia: number | null;
  titulo: string;
  comando: string;
  regra: string;
  categoria: string;
  raridade_alvo: string;
  hashtag: string | null;
  publicada_em: string | null;
}

function mapearQuest(l: LinhaQuest): Quest {
  return {
    id: l.id,
    dia: l.dia,
    titulo: l.titulo,
    comando: l.comando,
    regra: l.regra,
    categoria: l.categoria,
    raridadeAlvo: l.raridade_alvo as Raridade,
    hashtag: l.hashtag,
    publicadaEm: l.publicada_em,
  };
}

/**
 * A quest publicada para uma data-calendário (chave 'YYYY-MM-DD' no fuso SP,
 * ver dominio/datas.ts). Retorna null se ainda não há quest para o dia.
 */
export async function buscarQuestDoDia(chaveDia: string): Promise<Quest | null> {
  const { data, error } = await supabase
    .from('quests')
    .select(CAMPOS_QUEST)
    .eq('status', 'publicada')
    .eq('publicada_em', chaveDia)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapearQuest(data as LinhaQuest) : null;
}

/** Últimas quests publicadas (arquivo), mais recentes primeiro. */
export async function buscarArquivo(limite = 30): Promise<Quest[]> {
  const { data, error } = await supabase
    .from('quests')
    .select(CAMPOS_QUEST)
    .eq('status', 'publicada')
    .order('publicada_em', { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return (data as LinhaQuest[]).map(mapearQuest);
}

export interface OpcoesCumprir {
  /** URL do post no TikTok (opcional; concede o selo PROVADO se válida). */
  tiktokUrl?: string | null;
}

/**
 * Marca CUMPRI na quest de hoje. O EFEITO (registrar, streak +1, conceder carta)
 * é derivado NO SERVIDOR pela Edge Function `processar-cumpri` com service_role
 * — o cliente não escreve streak/carta (a RLS proíbe) nem se autoconcede status.
 * Aqui validamos o link ANTES (falha rápida, CLAUDE.md) e traduzimos o erro da
 * função numa mensagem humana. Idempotente: cumprir de novo não dobra nada.
 */
export async function marcarCumpri(
  questId: string,
  { tiktokUrl = null }: OpcoesCumprir = {},
): Promise<ResultadoCumpri> {
  const urlLimpa = tiktokUrl?.trim() || null;

  if (urlLimpa !== null && !ehUrlTikTokValida(urlLimpa)) {
    throw new Error('Link de TikTok inválido.');
  }

  const { data, error } = await supabase.functions.invoke('processar-cumpri', {
    body: { questId, tiktokUrl: urlLimpa },
  });

  if (error) {
    throw new Error(await mensagemDoErro(error));
  }

  const r = data as ResultadoCumpri;
  return {
    provado: r.provado,
    streak: r.streak,
    melhor: r.melhor,
    ganhouCarta: r.ganhouCarta,
    carta: r.carta,
  };
}

/**
 * Extrai a mensagem humana que a Edge Function devolve em `{ erro }` (ex.: "Essa
 * não é a quest de hoje.", "Link de TikTok inválido."). Se não der, usa genérica.
 */
async function mensagemDoErro(erro: unknown): Promise<string> {
  const contexto = (erro as { context?: { json?: () => Promise<unknown> } }).context;
  try {
    const corpo = (await contexto?.json?.()) as { erro?: string } | undefined;
    if (corpo?.erro) return corpo.erro;
  } catch {
    /* sem corpo JSON → cai na genérica */
  }
  return 'O caos travou ao registrar. Tenta de novo.';
}

/** O usuário já cumpriu esta quest? (idempotência / estado da tela). */
export async function jaCumpriu(questId: string): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;

  const { data, error } = await supabase
    .from('completions')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('quest_id', questId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}

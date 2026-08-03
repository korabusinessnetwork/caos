/**
 * Serviço de ranking — leaderboard nacional de DIAS PROVADOS (decisão do dono:
 * apelido opt-in, só dias provados). A agregação entre usuários roda na função
 * `security definer` `ranking_dias_provados` no servidor (a RLS por usuário
 * impede o cliente de contar dados alheios); aqui só chamamos e mapeamos.
 * A função retorna apenas apelido + contagem de quem optou (minimização LGPD).
 */
import { supabase } from './supabase';
import type { EntradaRanking } from './tipos';

interface LinhaRanking {
  username: string;
  dias_provados: number;
}

/**
 * Top `limite` do ranking de dias provados. A posição 1..N é derivada da ordem
 * que a função já devolve (por dias_provados desc). Lista vazia é válida
 * (ninguém opt-in ainda) — não é erro.
 */
export async function buscarRankingProvados(limite = 50): Promise<EntradaRanking[]> {
  const { data, error } = await supabase.rpc('ranking_dias_provados', { limite });

  if (error) throw new Error('Não deu pra carregar o ranking.');

  return (data as LinhaRanking[] | null ?? []).map((l, i) => ({
    posicao: i + 1,
    username: l.username,
    valor: l.dias_provados,
  }));
}

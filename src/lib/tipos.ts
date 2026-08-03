/**
 * Tipos de domínio da aplicação (camelCase), mapeados das linhas do banco
 * (snake_case). A camada de serviços traduz um no outro — o resto do app só
 * conhece estes tipos, nunca o formato cru do Supabase.
 */

export type Raridade = 'comum' | 'rara' | 'lendaria' | 'secreta';

export type CategoriaQuest =
  | 'social'
  | 'performance'
  | 'criativa'
  | 'domestico'
  | 'insana';

/** Perfil público do usuário (profiles). */
export interface Perfil {
  id: string;
  username: string;
  titulo: string | null;
  /** Opt-in de aparecer no ranking nacional (LGPD: opt-out por padrão). */
  rankingPublico: boolean;
  createdAt: string;
}

/** Quest do dia, já publicada (quests com status = 'publicada'). */
export interface Quest {
  id: string;
  dia: number | null;
  titulo: string;
  comando: string;
  regra: string;
  categoria: string;
  raridadeAlvo: Raridade;
  hashtag: string | null;
  publicadaEm: string | null;
}

/** Estado de sequência do usuário (streaks). */
export interface EstadoStreak {
  atual: number;
  melhor: number;
  ultimaData: string | null;
}

/** Estado de vidas do usuário (lives). */
export interface EstadoVidas {
  disponivel: boolean;
  recarregaEm: string | null;
  extrasComprados: number;
}

/** Uma carta no álbum do usuário (user_cards + cards). */
export interface CartaAlbum {
  id: string; // user_cards.id
  cardId: string;
  nome: string;
  raridade: Raridade;
  temporada: number;
  arteUrl: string | null;
  provado: boolean;
  ganhaEm: string;
}

/** Resultado de marcar CUMPRI (o registro em completions). */
export interface Cumprimento {
  id: string;
  questId: string;
  provado: boolean;
  tiktokUrl: string | null;
  completedAt: string;
}

/** A carta concedida pelo CUMPRI de hoje (devolvida pela Edge Function). */
export interface CartaGanha {
  nome: string;
  raridade: Raridade;
  temporada: number;
  arteUrl: string | null;
  provado: boolean;
}

/**
 * Efeito do CUMPRI derivado NO SERVIDOR (Edge Function processar-cumpri): o
 * cliente nunca calcula o próprio streak nem se concede carta. `carta` é null
 * quando já se cumpriu antes (idempotente) ou a quest não tem carta.
 */
export interface ResultadoCumpri {
  provado: boolean;
  streak: number;
  melhor: number;
  ganhouCarta: boolean;
  carta: CartaGanha | null;
}

/**
 * Fogo do Caos — streak em dupla (ADR-007, tabela fires). Aceso enquanto os
 * dois cumprem; apaga para ambos se um falha. Marcos: normal → azul(30) → branco(90).
 */
export type MarcoFogo = 'normal' | 'azul' | 'branco';

export interface Fogo {
  id: string;
  parceiro: string;
  diasAceso: number;
  marco: MarcoFogo;
  parceiroCumpriuHoje: boolean;
}

/**
 * Uma linha do ranking (top streaks BR / fogos mais longos). O leaderboard
 * público depende de uma view agregada no servidor (fase 2) — o cliente não
 * consegue contar streaks alheios sob a RLS por usuário.
 */
export interface EntradaRanking {
  posicao: number;
  username: string;
  valor: number;
}

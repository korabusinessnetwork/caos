/**
 * Serviço de cartas — o álbum do usuário (user_cards + cards).
 *
 * A CONCESSÃO da carta (quem ganhou o quê) é decidida no servidor a partir do
 * CUMPRI (M4); a raridade é lógica pura em dominio/cartas.ts. Aqui só lemos o
 * que o usuário já conquistou. Campos explícitos, nunca select *.
 */
import { supabase } from './supabase';
import type { CartaAlbum, Raridade } from './tipos';

interface LinhaCartaAlbum {
  id: string;
  card_id: string;
  provado: boolean;
  ganha_em: string;
  cards: {
    nome: string;
    raridade: string;
    temporada: number;
    arte_url: string | null;
  } | null;
}

/** Álbum do usuário atual, das mais recentes para as mais antigas. */
export async function buscarAlbum(): Promise<CartaAlbum[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada. Entre novamente.');

  const { data, error } = await supabase
    .from('user_cards')
    .select('id, card_id, provado, ganha_em, cards(nome, raridade, temporada, arte_url)')
    .eq('user_id', auth.user.id)
    .order('ganha_em', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as unknown as LinhaCartaAlbum[])
    .filter((l) => l.cards !== null)
    .map((l) => ({
      id: l.id,
      cardId: l.card_id,
      nome: l.cards!.nome,
      raridade: l.cards!.raridade as Raridade,
      temporada: l.cards!.temporada,
      arteUrl: l.cards!.arte_url,
      provado: l.provado,
      ganhaEm: l.ganha_em,
    }));
}

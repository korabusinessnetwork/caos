/**
 * Dados de exemplo para o MODO_DEMO (dev sem backend). Nunca importados em
 * produção — as telas só os usam quando MODO_DEMO é true. Servem pra navegar a
 * estética e o loop sem Supabase.
 */
import type {
  CartaAlbum,
  EntradaRanking,
  EstadoStreak,
  EstadoVidas,
  Fogo,
  Perfil,
  Quest,
} from './tipos';

export const DEMO_STREAK: EstadoStreak = {
  atual: 12,
  melhor: 34,
  ultimaData: '2026-07-24',
};

export const DEMO_VIDAS: EstadoVidas = {
  disponivel: true,
  recarregaEm: null,
  extrasComprados: 0,
};

export const DEMO_PERFIL: Perfil = {
  id: 'demo',
  username: 'voce',
  titulo: 'Agente do Caos',
  createdAt: '2026-06-01',
};

/** Dias do mês atual marcados como cumpridos (para o calendário do streak). */
export const DEMO_DIAS_CUMPRIDOS: number[] = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];

export const DEMO_ALBUM: CartaAlbum[] = [
  {
    id: 'c1',
    cardId: 'q47',
    nome: 'O NARRADOR',
    raridade: 'rara',
    temporada: 1,
    arteUrl: null,
    provado: true,
    ganhaEm: '2026-07-24',
  },
  {
    id: 'c2',
    cardId: 'q46',
    nome: 'ESTÁTUA',
    raridade: 'comum',
    temporada: 1,
    arteUrl: null,
    provado: false,
    ganhaEm: '2026-07-23',
  },
  {
    id: 'c3',
    cardId: 'q40',
    nome: 'O GRITO',
    raridade: 'lendaria',
    temporada: 1,
    arteUrl: null,
    provado: true,
    ganhaEm: '2026-07-17',
  },
  {
    id: 'c4',
    cardId: 'q33',
    nome: 'ELOGIO CEGO',
    raridade: 'comum',
    temporada: 1,
    arteUrl: null,
    provado: false,
    ganhaEm: '2026-07-10',
  },
];

/** Quantas cartas a temporada tem no total (para as silhuetas faltantes). */
export const DEMO_TOTAL_TEMPORADA = 12;

export const DEMO_ARQUIVO: Quest[] = [
  {
    id: 'q46',
    dia: 46,
    titulo: 'ESTÁTUA',
    comando: 'Congele no meio da rua por 30 segundos. Não explique.',
    regra: 'Sem sorrir.',
    categoria: 'performance',
    raridadeAlvo: 'comum',
    hashtag: '#CaosDia46',
    publicadaEm: '2026-07-23',
  },
  {
    id: 'q45',
    dia: 45,
    titulo: 'TROCA DE NOME',
    comando: 'Se apresente com um nome falso o dia inteiro.',
    regra: 'Comprometa-se. Sem quebrar o personagem.',
    categoria: 'social',
    raridadeAlvo: 'rara',
    hashtag: '#CaosDia45',
    publicadaEm: '2026-07-22',
  },
  {
    id: 'q40',
    dia: 40,
    titulo: 'O GRITO',
    comando: 'Grite "EU EXISTO" do lugar mais alto que você achar.',
    regra: 'Tem que ecoar.',
    categoria: 'insana',
    raridadeAlvo: 'lendaria',
    hashtag: '#CaosDia40',
    publicadaEm: '2026-07-17',
  },
];

export const DEMO_RANKING_STREAK: EntradaRanking[] = [
  { posicao: 1, username: 'biel_caos', valor: 89 },
  { posicao: 2, username: 'ana.destroi', valor: 76 },
  { posicao: 3, username: 'zdatijolada', valor: 71 },
  { posicao: 4, username: 'mari_incendeia', valor: 64 },
  { posicao: 5, username: 'voce', valor: 12 },
];

export const DEMO_RANKING_FOGO: EntradaRanking[] = [
  { posicao: 1, username: 'biel_caos + duda', valor: 61 },
  { posicao: 2, username: 'ana + jp', valor: 54 },
  { posicao: 3, username: 'voce + guilherme', valor: 9 },
];

export const DEMO_FOGOS: Fogo[] = [
  {
    id: 'f1',
    parceiro: 'guilherme',
    diasAceso: 9,
    marco: 'normal',
    parceiroCumpriuHoje: false,
  },
  {
    id: 'f2',
    parceiro: 'duda',
    diasAceso: 33,
    marco: 'azul',
    parceiroCumpriuHoje: true,
  },
];

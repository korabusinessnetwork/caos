/**
 * Recarga de vidas — 1 vida a cada 24h até a capacidade (ADR-005 / regras §2).
 *
 * A âncora marca o instante a partir do qual o próximo ciclo de 24h conta.
 * O tempo só "corre" enquanto o usuário está ABAIXO da capacidade — vida cheia
 * não acumula tempo ocioso (a âncora acompanha o presente).
 *
 * Função pura: recebe `agora` (epoch ms) por parâmetro, nunca lê Date.now().
 */

export const VIDAS_INTERVALO_MS = 24 * 60 * 60 * 1000;

export interface EstadoVidas {
  vidas: number;
  capacidade: number;
  recargaAncora: number; // epoch ms
}

export interface ResultadoRecarga {
  vidas: number;
  recargaAncora: number;
  recarregou: number;
}

export function recarregarVidas(
  estado: EstadoVidas,
  agora: number,
  intervaloMs: number = VIDAS_INTERVALO_MS,
): ResultadoRecarga {
  const capacidade = Math.max(0, Math.trunc(estado.capacidade));
  const vidas = Math.min(capacidade, Math.max(0, Math.trunc(estado.vidas)));

  if (vidas >= capacidade) {
    return { vidas: capacidade, recargaAncora: agora, recarregou: 0 };
  }

  const decorrido = Math.max(0, agora - estado.recargaAncora);
  const ciclos = Math.floor(decorrido / intervaloMs);
  if (ciclos <= 0) {
    return { vidas, recargaAncora: estado.recargaAncora, recarregou: 0 };
  }

  const espaco = capacidade - vidas;
  const ganhas = Math.min(ciclos, espaco);
  const novasVidas = vidas + ganhas;

  // Se encheu, zera o relógio no presente; senão, avança pelos ciclos consumidos.
  const novaAncora =
    novasVidas >= capacidade ? agora : estado.recargaAncora + ganhas * intervaloMs;

  return { vidas: novasVidas, recargaAncora: novaAncora, recarregou: ganhas };
}

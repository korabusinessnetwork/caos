/**
 * Raridade da carta do dia (ADR-003 / regras §3).
 *
 * Precedência: secreta > lendária > rara > comum.
 *  - Secreta   → easter egg.
 *  - Lendária  → semana completa (7 dias) sem falhar.
 *  - Rara      → Sábado do Caos.
 *  - Comum     → dia normal.
 *
 * Selo PROVADO (ADR-006) é ortogonal à raridade: vale para qualquer carta
 * cuja quest teve link de TikTok válido colado.
 */
import { ehUrlTikTokValida } from './tiktok';

export type Raridade = 'comum' | 'rara' | 'lendaria' | 'secreta';

export interface ContextoCarta {
  ehSabadoDoCaos: boolean;
  semanaLimpaCompleta: boolean;
  ehEasterEgg: boolean;
}

export function definirRaridade(ctx: ContextoCarta): Raridade {
  if (ctx.ehEasterEgg) return 'secreta';
  if (ctx.semanaLimpaCompleta) return 'lendaria';
  if (ctx.ehSabadoDoCaos) return 'rara';
  return 'comum';
}

/** Concede o selo PROVADO quando há link de TikTok válido. */
export function temSeloProvado(tiktokUrl: string | null | undefined): boolean {
  return ehUrlTikTokValida(tiktokUrl);
}

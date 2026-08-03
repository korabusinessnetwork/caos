import { describe, it, expect } from 'vitest';
import { recarregarVidas, VIDAS_INTERVALO_MS } from './vidas';

const H = 60 * 60 * 1000;

describe('recarregarVidas', () => {
  it('vida cheia: não recarrega e âncora acompanha o presente', () => {
    const r = recarregarVidas({ vidas: 1, capacidade: 1, recargaAncora: 0 }, 100 * H);
    expect(r).toEqual({ vidas: 1, recargaAncora: 100 * H, recarregou: 0 });
  });

  it('menos de 24h: não recarrega', () => {
    const r = recarregarVidas({ vidas: 0, capacidade: 1, recargaAncora: 0 }, 23 * H);
    expect(r.recarregou).toBe(0);
    expect(r.vidas).toBe(0);
    expect(r.recargaAncora).toBe(0);
  });

  it('exatamente 24h: recarrega 1', () => {
    const r = recarregarVidas({ vidas: 0, capacidade: 2, recargaAncora: 0 }, VIDAS_INTERVALO_MS);
    expect(r).toEqual({ vidas: 1, recargaAncora: VIDAS_INTERVALO_MS, recarregou: 1 });
  });

  it('50h com capacidade 2: enche e zera o relógio no presente', () => {
    const agora = 50 * H;
    const r = recarregarVidas({ vidas: 0, capacidade: 2, recargaAncora: 0 }, agora);
    expect(r).toEqual({ vidas: 2, recargaAncora: agora, recarregou: 2 });
  });

  it('não passa da capacidade mesmo com muito tempo decorrido', () => {
    const agora = 72 * H;
    const r = recarregarVidas({ vidas: 0, capacidade: 2, recargaAncora: 0 }, agora);
    expect(r.vidas).toBe(2);
    expect(r.recarregou).toBe(2);
  });
});

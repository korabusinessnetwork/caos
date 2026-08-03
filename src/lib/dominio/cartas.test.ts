import { describe, it, expect } from 'vitest';
import { definirRaridade, temSeloProvado } from './cartas';

const base = { ehSabadoDoCaos: false, semanaLimpaCompleta: false, ehEasterEgg: false };

describe('definirRaridade', () => {
  it('dia normal → comum', () => {
    expect(definirRaridade(base)).toBe('comum');
  });

  it('Sábado do Caos → rara', () => {
    expect(definirRaridade({ ...base, ehSabadoDoCaos: true })).toBe('rara');
  });

  it('semana completa sem falhar → lendária', () => {
    expect(definirRaridade({ ...base, semanaLimpaCompleta: true })).toBe('lendaria');
  });

  it('easter egg → secreta', () => {
    expect(definirRaridade({ ...base, ehEasterEgg: true })).toBe('secreta');
  });

  it('precedência: easter egg vence tudo', () => {
    expect(
      definirRaridade({ ehSabadoDoCaos: true, semanaLimpaCompleta: true, ehEasterEgg: true }),
    ).toBe('secreta');
  });

  it('precedência: lendária vence rara', () => {
    expect(definirRaridade({ ...base, ehSabadoDoCaos: true, semanaLimpaCompleta: true })).toBe(
      'lendaria',
    );
  });
});

describe('temSeloProvado', () => {
  it('com link válido → true', () => {
    expect(temSeloProvado('https://www.tiktok.com/@u/video/1')).toBe(true);
  });
  it('sem link ou inválido → false', () => {
    expect(temSeloProvado(null)).toBe(false);
    expect(temSeloProvado('https://instagram.com/x')).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { processarDia, tituloPorStreak } from './streak';

describe('processarDia', () => {
  it('cumpriu: streak +1 e ganha a carta', () => {
    expect(processarDia({ streak: 5, vidas: 1 }, true)).toEqual({
      streak: 6,
      vidas: 1,
      ganhouCarta: true,
      vidaConsumida: false,
      streakZerou: false,
    });
  });

  it('não cumpriu com vida: a vida absorve, streak sobrevive, sem carta', () => {
    expect(processarDia({ streak: 5, vidas: 1 }, false)).toEqual({
      streak: 5,
      vidas: 0,
      ganhouCarta: false,
      vidaConsumida: true,
      streakZerou: false,
    });
  });

  it('não cumpriu sem vida: streak zera', () => {
    expect(processarDia({ streak: 5, vidas: 0 }, false)).toEqual({
      streak: 0,
      vidas: 0,
      ganhouCarta: false,
      vidaConsumida: false,
      streakZerou: true,
    });
  });

  it('não cumpriu sem vida e streak já 0: não marca "zerou"', () => {
    expect(processarDia({ streak: 0, vidas: 0 }, false).streakZerou).toBe(false);
  });

  it('saneia entradas negativas/fracionárias', () => {
    expect(processarDia({ streak: -3, vidas: -1 }, true).streak).toBe(1);
    expect(processarDia({ streak: 2.9, vidas: 1.9 }, true)).toMatchObject({ streak: 3, vidas: 1 });
  });
});

describe('tituloPorStreak', () => {
  it('mapeia as faixas de título', () => {
    expect(tituloPorStreak(0)).toBeNull();
    expect(tituloPorStreak(3)).toBe('Iniciado');
    expect(tituloPorStreak(7)).toBe('Agente do Caos');
    expect(tituloPorStreak(30)).toBe('Lenda');
    expect(tituloPorStreak(90)).toBe('亡者 do Caos');
    expect(tituloPorStreak(200)).toBe('亡者 do Caos');
  });
});

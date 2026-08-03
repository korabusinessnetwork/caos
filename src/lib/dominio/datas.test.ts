import { describe, it, expect } from 'vitest';
import {
  partesEmSP,
  chaveDiaCaos,
  questRevelada,
  msAteProximaRevelacao,
  numeroDoDia,
} from './datas';

const H = 60 * 60 * 1000;

describe('partesEmSP', () => {
  it('extrai a hora de parede no fuso de São Paulo', () => {
    const p = partesEmSP(new Date('2026-07-24T10:30:15-03:00'));
    expect(p).toMatchObject({ ano: 2026, mes: 7, dia: 24, hora: 10, minuto: 30, segundo: 15 });
  });
});

describe('chaveDiaCaos', () => {
  it('usa a data-calendário em SP', () => {
    expect(chaveDiaCaos(new Date('2026-07-24T10:00:00-03:00'))).toBe('2026-07-24');
  });

  it('vira o dia corretamente no limite de fuso (UTC vs SP)', () => {
    // 02:00Z de 24/07 = 23:00 de 23/07 em SP (UTC-3)
    expect(chaveDiaCaos(new Date('2026-07-24T02:00:00Z'))).toBe('2026-07-23');
  });
});

describe('questRevelada', () => {
  it('antes das 7h → false (mostra countdown)', () => {
    expect(questRevelada(new Date('2026-07-24T06:59:00-03:00'))).toBe(false);
  });
  it('às 7h em ponto → true', () => {
    expect(questRevelada(new Date('2026-07-24T07:00:00-03:00'))).toBe(true);
  });
});

describe('msAteProximaRevelacao', () => {
  it('às 6h SP faltam 1h para as 7h', () => {
    expect(msAteProximaRevelacao(new Date('2026-07-24T06:00:00-03:00'))).toBe(1 * H);
  });
  it('às 8h SP faltam 23h para as 7h do dia seguinte', () => {
    expect(msAteProximaRevelacao(new Date('2026-07-24T08:00:00-03:00'))).toBe(23 * H);
  });
});

describe('numeroDoDia', () => {
  it('o dia do lançamento é o dia 1', () => {
    expect(numeroDoDia(new Date('2026-07-24T09:00:00-03:00'), '2026-07-24')).toBe(1);
  });
  it('conta os dias corridos desde o lançamento', () => {
    expect(numeroDoDia(new Date('2026-08-02T09:00:00-03:00'), '2026-07-24')).toBe(10);
  });
});

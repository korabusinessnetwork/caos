/**
 * Streak + Vidas — lógica pura da virada do dia (ADR-005 / regras §2).
 *
 * Regra:
 *  - Cumpriu    → streak +1 e ganha a carta do dia.
 *  - Não cumpriu, com vida → a vida absorve; streak sobrevive, mas SEM carta.
 *  - Não cumpriu, sem vida → streak zera.
 *
 * Função pura: não lê relógio nem banco. Estado entra, resultado sai.
 */

export interface EstadoStreak {
  streak: number;
  vidas: number;
}

export interface ResultadoDia {
  streak: number;
  vidas: number;
  ganhouCarta: boolean;
  vidaConsumida: boolean;
  streakZerou: boolean;
}

export function processarDia(estado: EstadoStreak, cumpriu: boolean): ResultadoDia {
  const streakAtual = Math.max(0, Math.trunc(estado.streak));
  const vidasAtuais = Math.max(0, Math.trunc(estado.vidas));

  if (cumpriu) {
    return {
      streak: streakAtual + 1,
      vidas: vidasAtuais,
      ganhouCarta: true,
      vidaConsumida: false,
      streakZerou: false,
    };
  }

  if (vidasAtuais > 0) {
    return {
      streak: streakAtual,
      vidas: vidasAtuais - 1,
      ganhouCarta: false,
      vidaConsumida: true,
      streakZerou: false,
    };
  }

  return {
    streak: 0,
    vidas: 0,
    ganhouCarta: false,
    vidaConsumida: false,
    streakZerou: streakAtual > 0,
  };
}

/** Título por streak (regras §2 / CAOS_FUNDACAO §4.4). */
export function tituloPorStreak(streak: number): string | null {
  if (streak >= 90) return '亡者 do Caos';
  if (streak >= 30) return 'Lenda';
  if (streak >= 7) return 'Agente do Caos';
  if (streak >= 3) return 'Iniciado';
  return null;
}

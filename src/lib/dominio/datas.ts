/**
 * Datas do caos — tudo ancorado no fuso America/Sao_Paulo (ADR-002).
 *
 * Sem libs de data: usa Intl para extrair a hora de parede no fuso correto,
 * então funciona em qualquer máquina independentemente do fuso local do device.
 * Premissa: o Brasil não observa horário de verão (desde 2019), logo dentro de
 * um mesmo dia o tempo de parede ≈ tempo real (usado no countdown das 7h).
 *
 * A "quest de hoje" pertence à data-calendário em SP e é revelada às 7h.
 * Antes das 7h → countdown (nunca tela vazia — princípio nº1).
 *
 * Funções puras: recebem a Date por parâmetro, nunca chamam new Date() interno.
 */

export const TZ = 'America/Sao_Paulo';
export const HORA_REVELACAO = 7;

export interface PartesData {
  ano: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
  segundo: number;
}

export function partesEmSP(data: Date, tz: string = TZ): PartesData {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(data)) {
    if (part.type !== 'literal') p[part.type] = part.value;
  }

  let hora = Number(p.hour);
  if (hora === 24) hora = 0; // alguns runtimes devolvem "24" à meia-noite

  return {
    ano: Number(p.year),
    mes: Number(p.month),
    dia: Number(p.day),
    hora,
    minuto: Number(p.minute),
    segundo: Number(p.second),
  };
}

const pad = (n: number): string => String(n).padStart(2, '0');

/** Chave da quest do dia (data-calendário no fuso SP): 'YYYY-MM-DD'. */
export function chaveDiaCaos(data: Date, tz: string = TZ): string {
  const { ano, mes, dia } = partesEmSP(data, tz);
  return `${ano}-${pad(mes)}-${pad(dia)}`;
}

/** A quest de hoje já foi revelada? (>= 7h no fuso SP). Antes disso, countdown. */
export function questRevelada(
  data: Date,
  tz: string = TZ,
  horaRevelacao: number = HORA_REVELACAO,
): boolean {
  return partesEmSP(data, tz).hora >= horaRevelacao;
}

function segundosNoDiaSP(data: Date, tz: string): number {
  const { hora, minuto, segundo } = partesEmSP(data, tz);
  return hora * 3600 + minuto * 60 + segundo;
}

/** Milissegundos até a próxima revelação das 7h (para o countdown). */
export function msAteProximaRevelacao(
  data: Date,
  tz: string = TZ,
  horaRevelacao: number = HORA_REVELACAO,
): number {
  const seg = segundosNoDiaSP(data, tz);
  const alvo = horaRevelacao * 3600;
  const restanteSeg = seg < alvo ? alvo - seg : 24 * 3600 - seg + alvo;
  return restanteSeg * 1000;
}

function diffDias(deISO: string, ateISO: string): number {
  const [a1, m1, d1] = deISO.split('-').map(Number);
  const [a2, m2, d2] = ateISO.split('-').map(Number);
  const t1 = Date.UTC(a1, m1 - 1, d1);
  const t2 = Date.UTC(a2, m2 - 1, d2);
  return Math.round((t2 - t1) / 86_400_000);
}

/** Nº do dia do caos para a hashtag #CaosDia{N}, a partir do lançamento (inclusive). */
export function numeroDoDia(data: Date, dataLancamentoISO: string, tz: string = TZ): number {
  return diffDias(dataLancamentoISO, chaveDiaCaos(data, tz)) + 1;
}

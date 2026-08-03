import { useCallback, useEffect, useState } from 'react';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { PortaoAuth } from '../components/shared/PortaoAuth';
import { StreakBadge } from '../components/shared/StreakBadge';
import { VidaIndicator } from '../components/shared/VidaIndicator';
import { tituloPorStreak } from '../lib/dominio/streak';
import { buscarDiasCumpridos, buscarStreak } from '../lib/streak';
import { buscarVidas } from '../lib/lives';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_DIAS_CUMPRIDOS, DEMO_STREAK, DEMO_VIDAS } from '../lib/demo';
import type { EstadoStreak, EstadoVidas } from '../lib/tipos';
import './Streak.css';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface CelulaDia {
  dia: number | null;
  cumprido: boolean;
  hoje: boolean;
}

/** Monta a grade do mês atual, marcando os dias cumpridos e o dia de hoje. */
function montarCalendario(diasCumpridos: number[]): CelulaDia[] {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth();
  const inicioSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const hoje = agora.getDate();
  const setCumpridos = new Set(diasCumpridos);

  const celulas: CelulaDia[] = [];
  for (let i = 0; i < inicioSemana; i++) {
    celulas.push({ dia: null, cumprido: false, hoje: false });
  }
  for (let d = 1; d <= totalDias; d++) {
    celulas.push({ dia: d, cumprido: setCumpridos.has(d), hoje: d === hoje });
  }
  return celulas;
}

function ConteudoStreak() {
  const [estado, setEstado] = useState<Estado>('loading');
  const [streak, setStreak] = useState<EstadoStreak | null>(null);
  const [vidas, setVidas] = useState<EstadoVidas | null>(null);
  const [diasCumpridos, setDiasCumpridos] = useState<number[]>([]);

  const carregar = useCallback(async () => {
    setEstado('loading');
    if (MODO_DEMO) {
      setStreak(DEMO_STREAK);
      setVidas(DEMO_VIDAS);
      setDiasCumpridos(DEMO_DIAS_CUMPRIDOS);
      setEstado('success');
      return;
    }
    try {
      // Calendário real: dias com CUMPRI no mês corrente (mesmo mês da grade
      // de montarCalendario; o dia da célula é resolvido em SP no serviço).
      const agora = new Date();
      const [s, v, dias] = await Promise.all([
        buscarStreak(),
        buscarVidas(),
        buscarDiasCumpridos(agora.getFullYear(), agora.getMonth() + 1),
      ]);
      setStreak(s);
      setVidas(v);
      setDiasCumpridos(dias);
      setEstado('success');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <EstadoTela
      estado={estado}
      onTentarNovamente={carregar}
      mensagemErro="não deu pra carregar seu streak. tenta de novo."
    >
      {streak && (
        <div className="streak">
          <StreakBadge
            streak={streak.atual}
            titulo={tituloPorStreak(streak.atual)}
            tamanho="grande"
          />

          <div className="streak__stats">
            <div className="streak__stat">
              <span className="streak__stat-num">{streak.melhor}</span>
              <span className="streak__stat-rot">melhor streak</span>
            </div>
            {vidas && (
              <VidaIndicator
                disponivel={vidas.disponivel}
                recarregaEm={vidas.recarregaEm}
              />
            )}
          </div>

          <div className="streak__cal">
            <div className="streak__cal-semana">
              {DIAS_SEMANA.map((d, i) => (
                <span key={i} className="streak__cal-dow">
                  {d}
                </span>
              ))}
            </div>
            <div className="streak__cal-grade">
              {montarCalendario(diasCumpridos).map((c, i) => (
                <span
                  key={i}
                  className={[
                    'streak__cal-dia',
                    c.dia == null ? 'streak__cal-dia--vazio' : '',
                    c.cumprido ? 'streak__cal-dia--cumprido' : '',
                    c.hoje ? 'streak__cal-dia--hoje' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {c.dia ?? ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </EstadoTela>
  );
}

export function Streak() {
  return (
    <PortaoAuth chamada="entre pra ver seu streak.">
      <ConteudoStreak />
    </PortaoAuth>
  );
}

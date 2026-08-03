import { useEffect, useState } from 'react';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_RANKING_FOGO, DEMO_RANKING_STREAK } from '../lib/demo';
import type { EntradaRanking } from '../lib/tipos';
import './Ranking.css';

type Aba = 'streak' | 'fogo';

function ListaRanking({ entradas }: { entradas: EntradaRanking[] }) {
  return (
    <ol className="ranking__lista">
      {entradas.map((e) => (
        <li
          key={`${e.posicao}-${e.username}`}
          className={`ranking__linha ${
            e.username.includes('voce') ? 'ranking__linha--voce' : ''
          }`}
        >
          <span className="ranking__pos">{e.posicao}</span>
          <span className="ranking__user">{e.username}</span>
          <span className="ranking__valor">{e.valor}</span>
        </li>
      ))}
    </ol>
  );
}

export function Ranking() {
  const [estado, setEstado] = useState<Estado>('loading');
  const [aba, setAba] = useState<Aba>('streak');
  const [streaks, setStreaks] = useState<EntradaRanking[]>([]);
  const [fogos, setFogos] = useState<EntradaRanking[]>([]);

  useEffect(() => {
    if (MODO_DEMO) {
      setStreaks(DEMO_RANKING_STREAK);
      setFogos(DEMO_RANKING_FOGO);
      setEstado('success');
      return;
    }
    // O leaderboard público depende de uma view agregada no servidor (fase 2):
    // a RLS por usuário impede o cliente de contar streaks alheios.
    setEstado('empty');
  }, []);

  const entradas = aba === 'streak' ? streaks : fogos;

  return (
    <div className="ranking">
      <header className="ranking__topo">
        <h2 className="ranking__titulo">ranking do caos</h2>
        <div className="ranking__abas" role="tablist">
          <button
            role="tab"
            aria-selected={aba === 'streak'}
            className={`ranking__aba ${aba === 'streak' ? 'ranking__aba--ativa' : ''}`}
            onClick={() => setAba('streak')}
          >
            maiores streaks
          </button>
          <button
            role="tab"
            aria-selected={aba === 'fogo'}
            className={`ranking__aba ${aba === 'fogo' ? 'ranking__aba--ativa' : ''}`}
            onClick={() => setAba('fogo')}
          >
            fogos mais longos
          </button>
        </div>
      </header>

      <EstadoTela
        estado={estado}
        mensagemVazio="o ranking nacional acende quando o caos crescer. volta logo."
        mensagemErro="não deu pra carregar o ranking."
      >
        <ListaRanking entradas={entradas} />
      </EstadoTela>
    </div>
  );
}

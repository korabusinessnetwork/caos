import { useCallback, useEffect, useState } from 'react';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { PortaoAuth } from '../components/shared/PortaoAuth';
import { buscarAlbum, contarCartasTemporada } from '../lib/cards';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_ALBUM, DEMO_TOTAL_TEMPORADA } from '../lib/demo';
import type { CartaAlbum, Raridade } from '../lib/tipos';
import './AlbumDoCaos.css';

const FORMA: Record<Raridade, string> = {
  comum: '●',
  rara: '◆',
  lendaria: '★',
  secreta: '✶',
};

function ConteudoAlbum() {
  const [estado, setEstado] = useState<Estado>('loading');
  const [cartas, setCartas] = useState<CartaAlbum[]>([]);
  const [totalTemporada, setTotalTemporada] = useState(0);

  const carregar = useCallback(async () => {
    setEstado('loading');
    if (MODO_DEMO) {
      setCartas(DEMO_ALBUM);
      setTotalTemporada(DEMO_TOTAL_TEMPORADA);
      setEstado('success');
      return;
    }
    try {
      const album = await buscarAlbum();
      setCartas(album);
      if (album.length === 0) {
        setTotalTemporada(0);
        setEstado('empty');
        return;
      }
      // Total da temporada (pra desenhar as silhuetas faltantes) vem do catálogo
      // público de cards, pela temporada da carta mais recente do usuário.
      setTotalTemporada(await contarCartasTemporada(album[0].temporada));
      setEstado('success');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const faltantes = Math.max(0, totalTemporada - cartas.length);

  return (
    <EstadoTela
      estado={estado}
      onTentarNovamente={carregar}
      mensagemVazio="seu álbum tá vazio. cumpra a quest de hoje e comece a coleção."
      mensagemErro="não deu pra abrir o álbum. tenta de novo."
    >
      <div className="album">
        <header className="album__topo">
          <h2 className="album__titulo">álbum do caos</h2>
          <span className="album__contagem">
            {cartas.length}
            {totalTemporada > cartas.length ? `/${totalTemporada}` : ''} cartas
          </span>
        </header>

        <div className="album__grid">
          {cartas.map((c) => (
            <article
              key={c.id}
              className={`carta-mini carta-mini--${c.raridade}`}
              aria-label={`${c.nome}, ${c.raridade}${c.provado ? ', provado' : ''}`}
            >
              <span className="carta-mini__forma" aria-hidden="true">
                {FORMA[c.raridade]}
              </span>
              <span className="carta-mini__nome">{c.nome}</span>
              {c.provado && <span className="carta-mini__selo">provado</span>}
            </article>
          ))}

          {Array.from({ length: faltantes }).map((_, i) => (
            <article
              key={`silhueta-${i}`}
              className="carta-mini carta-mini--silhueta"
              aria-label="carta ainda não conquistada"
            >
              <span className="carta-mini__forma" aria-hidden="true">
                ?
              </span>
            </article>
          ))}
        </div>
      </div>
    </EstadoTela>
  );
}

export function AlbumDoCaos() {
  return (
    <PortaoAuth chamada="entre pra ver seu álbum.">
      <ConteudoAlbum />
    </PortaoAuth>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { CardDoCaos } from '../components/shared/CardDoCaos';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { buscarArquivo } from '../lib/quests';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_ARQUIVO } from '../lib/demo';
import type { Quest, Raridade } from '../lib/tipos';
import './ArquivoDoCaos.css';

const FORMA: Record<Raridade, string> = {
  comum: '●',
  rara: '◆',
  lendaria: '★',
  secreta: '✶',
};

export function ArquivoDoCaos() {
  const [estado, setEstado] = useState<Estado>('loading');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [abertaId, setAbertaId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setEstado('loading');
    if (MODO_DEMO) {
      setQuests(DEMO_ARQUIVO);
      setEstado('success');
      return;
    }
    try {
      const arquivo = await buscarArquivo();
      setQuests(arquivo);
      setEstado(arquivo.length === 0 ? 'empty' : 'success');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <div className="arquivo">
      <header className="arquivo__topo">
        <h2 className="arquivo__titulo">o caos que já passou</h2>
        <p className="arquivo__sub">o que você perdeu não volta.</p>
      </header>

      <EstadoTela
        estado={estado}
        onTentarNovamente={carregar}
        mensagemVazio="ainda não há caos no arquivo. o primeiro cai às 7h."
        mensagemErro="não deu pra abrir o arquivo. tenta de novo."
      >
        <ul className="arquivo__lista">
          {quests.map((q) => {
            const aberta = abertaId === q.id;
            return (
              <li key={q.id} className="arquivo__item">
                <button
                  type="button"
                  className="arquivo__strip"
                  aria-expanded={aberta}
                  onClick={() => setAbertaId(aberta ? null : q.id)}
                >
                  <span className="arquivo__dia">
                    {q.dia != null ? `dia ${q.dia}` : '—'}
                  </span>
                  <span className="arquivo__nome">{q.titulo}</span>
                  <span
                    className={`arquivo__forma arquivo__forma--${q.raridadeAlvo}`}
                    aria-label={`raridade ${q.raridadeAlvo}`}
                  >
                    {FORMA[q.raridadeAlvo]}
                  </span>
                </button>

                {aberta && (
                  <div className="arquivo__carta">
                    <CardDoCaos
                      dia={q.dia}
                      hashtag={q.hashtag}
                      titulo={q.titulo}
                      comando={q.comando}
                      regra={q.regra}
                      raridade={q.raridadeAlvo}
                      selo={null}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </EstadoTela>
    </div>
  );
}

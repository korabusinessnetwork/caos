import { useState } from 'react';
import { definirRankingPublico } from '../../lib/perfil';
import './ToggleRanking.css';

/**
 * Opt-in do ranking nacional (LGPD: opt-out por padrão). Liga a exposição do
 * APELIDO do usuário no leaderboard de dias provados. Só no fluxo real (o Perfil
 * o esconde em MODO_DEMO). Escreve a própria linha via `definirRankingPublico`.
 */
interface ToggleRankingProps {
  inicial: boolean;
}

export function ToggleRanking({ inicial }: ToggleRankingProps) {
  const [ativo, setAtivo] = useState(inicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);

  async function alternar() {
    if (salvando) return;
    const proximo = !ativo;
    setSalvando(true);
    setErro(false);
    try {
      await definirRankingPublico(proximo);
      setAtivo(proximo);
    } catch {
      setErro(true);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="toggle-rank">
      <div className="toggle-rank__texto">
        <p className="toggle-rank__titulo">aparecer no ranking nacional</p>
        <p className="toggle-rank__sub">
          mostra seu @apelido e seus dias provados no ranking. você escolhe.
        </p>
        {erro && (
          <p className="toggle-rank__erro" role="alert">
            não deu pra salvar. tenta de novo.
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        aria-label="aparecer no ranking nacional"
        className={`toggle-rank__switch${ativo ? ' toggle-rank__switch--on' : ''}`}
        onClick={alternar}
        disabled={salvando}
        aria-busy={salvando}
      >
        <span className="toggle-rank__bolinha" aria-hidden="true" />
      </button>
    </section>
  );
}

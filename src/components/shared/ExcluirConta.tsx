import { useState } from 'react';
import { excluirConta } from '../../lib/auth';
import './ExcluirConta.css';

/**
 * Exclusão de conta (LGPD — público inclui menores 16+). Ação destrutiva e
 * irreversível: prevenção de erro > mensagem de erro (princípio nº1), então
 * exige confirmação em dois passos. No sucesso, `excluirConta()` já faz signOut
 * — o AuthContext reage e o app volta ao estado deslogado. Só renderizada no
 * fluxo real (o Perfil a esconde em MODO_DEMO).
 */
type Fase = 'idle' | 'confirmando' | 'excluindo' | 'erro';

export function ExcluirConta() {
  const [fase, setFase] = useState<Fase>('idle');

  async function confirmar() {
    setFase('excluindo');
    try {
      await excluirConta();
      // Sucesso: o signOut dispara a saída da sessão; nada mais a renderizar aqui.
    } catch {
      setFase('erro');
    }
  }

  if (fase === 'idle') {
    return (
      <button
        type="button"
        className="excluir__abrir"
        onClick={() => setFase('confirmando')}
      >
        excluir minha conta
      </button>
    );
  }

  const excluindo = fase === 'excluindo';

  return (
    <div className="excluir" role="group" aria-label="excluir conta">
      <p className="excluir__aviso">
        isso apaga tudo — streak, cartas, histórico — e não tem volta.
      </p>

      {fase === 'erro' && (
        <p className="excluir__erro" role="alert">
          não deu pra excluir agora. tenta de novo.
        </p>
      )}

      <div className="excluir__acoes">
        <button
          type="button"
          className="excluir__cancelar"
          onClick={() => setFase('idle')}
          disabled={excluindo}
        >
          cancelar
        </button>
        <button
          type="button"
          className="excluir__confirmar"
          onClick={confirmar}
          disabled={excluindo}
          aria-busy={excluindo}
        >
          {excluindo ? 'excluindo…' : 'excluir de vez'}
        </button>
      </div>
    </div>
  );
}

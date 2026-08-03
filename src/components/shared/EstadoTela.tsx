import type { ReactNode } from 'react';
import './EstadoTela.css';

/**
 * Wrapper de estados de tela — todo carregamento passa por aqui.
 * Regra de UI (patterns.md): loading · empty · error · success sempre visíveis,
 * nunca tela em branco e nunca "Error 500" cru (princípio nº1).
 */
export type Estado = 'loading' | 'empty' | 'error' | 'success';

interface EstadoTelaProps {
  estado: Estado;
  children: ReactNode;
  mensagemVazio?: string;
  mensagemErro?: string;
  onTentarNovamente?: () => void;
}

export function EstadoTela({
  estado,
  children,
  mensagemVazio = 'Nada por aqui ainda.',
  mensagemErro = 'Algo saiu do controle. O caos acontece.',
  onTentarNovamente,
}: EstadoTelaProps) {
  if (estado === 'loading') {
    return (
      <div className="estado estado--loading" role="status" aria-live="polite">
        <span className="estado__pulso" aria-hidden="true" />
        <p className="estado__texto">invocando o caos…</p>
      </div>
    );
  }

  if (estado === 'empty') {
    return (
      <div className="estado estado--empty">
        <p className="estado__texto">{mensagemVazio}</p>
      </div>
    );
  }

  if (estado === 'error') {
    return (
      <div className="estado estado--error" role="alert">
        <p className="estado__texto">{mensagemErro}</p>
        {onTentarNovamente && (
          <button className="estado__retry" onClick={onTentarNovamente}>
            tentar de novo
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

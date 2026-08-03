import { useEffect, useRef } from 'react';
import { tituloPorStreak } from '../../lib/dominio/streak';
import type { Raridade, ResultadoCumpri } from '../../lib/tipos';
import './PayoffCumpri.css';

/**
 * O payoff do CUMPRI — o pico emocional do loop (princípio nº1: emoção sobre
 * informação). Mostra os dados REAIS do ResultadoCumpri: streak conquistado,
 * título por streak (quando cruza a faixa) e a carta ganha (nome, raridade,
 * selo PROVADO). Sem carta (CUMPRI idempotente) → só o streak. Dispensável por
 * toque, "continuar" ou teclado (Esc/Enter).
 */
interface PayoffCumpriProps {
  resultado: ResultadoCumpri;
  questDia: number | null;
  onFechar: () => void;
}

// Rótulo + forma da raridade (não depender só de cor — design-system.md).
const RARIDADE_META: Record<Raridade, { rotulo: string; forma: string }> = {
  comum: { rotulo: 'comum', forma: '●' },
  rara: { rotulo: 'rara', forma: '◆' },
  lendaria: { rotulo: 'lendária', forma: '★' },
  secreta: { rotulo: 'secreta', forma: '✶' },
};

export function PayoffCumpri({ resultado, questDia, onFechar }: PayoffCumpriProps) {
  const continuarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continuarRef.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onFechar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [onFechar]);

  const titulo = tituloPorStreak(resultado.streak);
  const carta = resultado.carta;
  const meta = carta ? RARIDADE_META[carta.raridade] : null;

  return (
    <div
      className="payoff"
      role="dialog"
      aria-modal="true"
      aria-label="caos cumprido"
      onClick={onFechar}
    >
      <div className="payoff__conteudo" onClick={(e) => e.stopPropagation()}>
        <p className="payoff__chamada">
          {questDia != null ? `dia ${questDia} garantido` : 'dia garantido'}
        </p>

        <p className="payoff__streak">
          <span className="payoff__streak-num">{resultado.streak}</span>
          <span className="payoff__streak-rot">de streak</span>
        </p>

        {titulo && <p className="payoff__titulo">{titulo}</p>}

        {carta && meta && (
          <div className={`payoff__carta payoff__carta--${carta.raridade}`}>
            <span className="payoff__carta-marca" aria-hidden="true">
              CAOS
            </span>
            <span
              className="payoff__carta-raridade"
              aria-label={`carta ${meta.rotulo}`}
            >
              <span className="payoff__carta-forma" aria-hidden="true">
                {meta.forma}
              </span>
              {meta.rotulo}
            </span>
            <span className="payoff__carta-nome">{carta.nome}</span>
            {carta.provado && <span className="payoff__carta-selo">PROVADO</span>}
          </div>
        )}

        <button
          ref={continuarRef}
          type="button"
          className="payoff__continuar"
          onClick={onFechar}
        >
          continuar
        </button>
      </div>
    </div>
  );
}

import type { Fogo } from '../../lib/tipos';
import './FogoBadge.css';

/**
 * Fogo do Caos — streak em dupla (ADR-007). Aceso enquanto os dois cumprem.
 * Marcos: normal → azul (30d) → branco 亡者 (90d). Se o parceiro ainda não
 * cumpriu hoje, o badge cobra ("falta o guilherme") — a pressão social é o motor.
 */
interface FogoBadgeProps {
  fogo: Fogo;
}

const MARCO_GLYPH: Record<Fogo['marco'], string> = {
  normal: '🔥',
  azul: '🔥',
  branco: '亡',
};

export function FogoBadge({ fogo }: FogoBadgeProps) {
  const pendente = !fogo.parceiroCumpriuHoje;

  return (
    <div className={`fogo fogo--${fogo.marco}`}>
      <span className="fogo__glyph" aria-hidden="true">
        {MARCO_GLYPH[fogo.marco]}
      </span>
      <div className="fogo__info">
        <span className="fogo__dupla">você + {fogo.parceiro}</span>
        <span className="fogo__dias">
          {fogo.diasAceso} {fogo.diasAceso === 1 ? 'dia aceso' : 'dias aceso'}
        </span>
      </div>
      <span className={`fogo__estado ${pendente ? 'fogo__estado--pendente' : ''}`}>
        {pendente ? `falta ${fogo.parceiro}` : 'em dia'}
      </span>
    </div>
  );
}

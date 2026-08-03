import type { Raridade } from '../../lib/tipos';
import './CardDoCaos.css';

/**
 * O Card do Caos — o artefato que precisa ser reconhecível em 0,5s no feed
 * (design-system.md). Regras inegociáveis:
 *  · Watermark "CAOS" SEMPRE presente (canal de aquisição — ADR-008).
 *  · Raridade legível à distância e NÃO só por cor: rótulo + forma + cor.
 *  · Texto mínimo, impacto visual máximo.
 */
export type Selo = 'cumpri' | 'provado' | null;

interface CardDoCaosProps {
  dia: number | null;
  hashtag: string | null;
  titulo: string;
  comando: string;
  regra: string;
  raridade: Raridade;
  selo?: Selo;
}

const RARIDADE_META: Record<Raridade, { rotulo: string; forma: string }> = {
  comum: { rotulo: 'comum', forma: '●' },
  rara: { rotulo: 'rara', forma: '◆' },
  lendaria: { rotulo: 'lendária', forma: '★' },
  secreta: { rotulo: 'secreta', forma: '✶' },
};

const SELO_META: Record<Exclude<Selo, null>, string> = {
  cumpri: 'CUMPRI',
  provado: 'PROVADO',
};

export function CardDoCaos({
  dia,
  hashtag,
  titulo,
  comando,
  regra,
  raridade,
  selo = null,
}: CardDoCaosProps) {
  const meta = RARIDADE_META[raridade];

  return (
    <article className={`card card--${raridade}`}>
      <span className="card__watermark" aria-hidden="true">
        CAOS
      </span>

      <header className="card__topo">
        <span className="card__dia">{dia != null ? `DIA ${dia}` : 'HOJE'}</span>
        <span className="card__raridade" aria-label={`raridade ${meta.rotulo}`}>
          <span className="card__raridade-forma" aria-hidden="true">
            {meta.forma}
          </span>
          {meta.rotulo}
        </span>
      </header>

      <div className="card__corpo">
        <h1 className="card__titulo">{titulo}</h1>
        <p className="card__comando">{comando}</p>
        <p className="card__regra">
          <span className="card__regra-rotulo">a regra</span>
          {regra}
        </p>
      </div>

      <footer className="card__rodape">
        {hashtag && <span className="card__hashtag">{hashtag}</span>}
        {selo && (
          <span className={`card__selo card__selo--${selo}`}>{SELO_META[selo]}</span>
        )}
      </footer>
    </article>
  );
}

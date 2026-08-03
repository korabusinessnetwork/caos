import './VidaIndicator.css';

/**
 * Vida do Caos — o escudo que absorve 1 falha por dia (regras §2). Cheia (◆) ou
 * gasta (◇) + quando recarrega. Não depende só de cor: a forma preenchida/vazia
 * e o rótulo comunicam o estado.
 */
interface VidaIndicatorProps {
  disponivel: boolean;
  recarregaEm?: string | null;
}

function textoRecarga(recarregaEm: string | null | undefined): string {
  if (!recarregaEm) return 'recarrega amanhã';
  const alvo = new Date(recarregaEm).getTime();
  const faltaMs = alvo - Date.now();
  if (Number.isNaN(alvo) || faltaMs <= 0) return 'recarrega já já';

  const horas = Math.floor(faltaMs / 3_600_000);
  const minutos = Math.floor((faltaMs % 3_600_000) / 60_000);
  if (horas > 0) return `recarrega em ${horas}h ${minutos}m`;
  return `recarrega em ${minutos}m`;
}

export function VidaIndicator({ disponivel, recarregaEm }: VidaIndicatorProps) {
  return (
    <div className={`vida ${disponivel ? 'vida--cheia' : 'vida--gasta'}`}>
      <span className="vida__forma" aria-hidden="true">
        {disponivel ? '◆' : '◇'}
      </span>
      <span className="vida__texto">
        {disponivel ? 'vida disponível' : textoRecarga(recarregaEm)}
      </span>
    </div>
  );
}

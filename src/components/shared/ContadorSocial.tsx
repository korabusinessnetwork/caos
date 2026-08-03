import './ContadorSocial.css';

/**
 * Prova social no tom da marca: "8.412 já cumpriram. Você não."
 * Provocador e cúmplice (design-system.md → tom de voz). Muda o texto conforme
 * o usuário já cumpriu ou não — a pressão é o gatilho.
 */
interface ContadorSocialProps {
  total: number;
  jaCumpriu: boolean;
}

const nf = new Intl.NumberFormat('pt-BR');

export function ContadorSocial({ total, jaCumpriu }: ContadorSocialProps) {
  const n = Math.max(0, Math.trunc(total));

  return (
    <p className="contador-social">
      <strong className="contador-social__num">{nf.format(n)}</strong>{' '}
      {jaCumpriu ? (
        <span>já cumpriram. você também.</span>
      ) : (
        <span>
          já cumpriram. <span className="contador-social__voce">você não.</span>
        </span>
      )}
    </p>
  );
}

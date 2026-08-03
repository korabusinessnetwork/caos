import './StreakBadge.css';

/**
 * Número da sequência + título por streak. `tamanho="grande"` é o número
 * gigante da tela Streak; `compacto` entra no perfil e em cabeçalhos.
 */
interface StreakBadgeProps {
  streak: number;
  titulo?: string | null;
  tamanho?: 'grande' | 'compacto';
}

export function StreakBadge({
  streak,
  titulo = null,
  tamanho = 'grande',
}: StreakBadgeProps) {
  return (
    <div className={`streak-badge streak-badge--${tamanho}`}>
      <span className="streak-badge__numero">{streak}</span>
      <span className="streak-badge__unidade">
        {streak === 1 ? 'dia de caos' : 'dias de caos'}
      </span>
      {titulo && <span className="streak-badge__titulo">{titulo}</span>}
    </div>
  );
}

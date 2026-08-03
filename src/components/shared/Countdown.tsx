import { useEffect, useState } from 'react';
import { msAteProximaRevelacao } from '../../lib/dominio/datas';
import './Countdown.css';

/**
 * Countdown até a revelação das 7h. Antes das 7h a quest NÃO aparece — mostramos
 * o relógio, nunca tela vazia (princípio nº1 / fluxos.md). Roda offline: usa só
 * o relógio do device e a lógica pura de datas.ts.
 */
function formatar(ms: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
}

interface CountdownProps {
  /** Chamado quando o relógio zera (hora de buscar a quest). */
  onRevelou?: () => void;
}

export function Countdown({ onRevelou }: CountdownProps) {
  const [restante, setRestante] = useState(() => msAteProximaRevelacao(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      const ms = msAteProximaRevelacao(new Date());
      setRestante(ms);
      if (ms <= 1000) onRevelou?.();
    }, 1000);
    return () => clearInterval(id);
  }, [onRevelou]);

  const { h, m, s } = formatar(restante);

  return (
    <section className="countdown" aria-live="polite">
      <p className="countdown__rotulo">o caos chega em</p>
      <div className="countdown__relogio" aria-label={`${h} horas, ${m} minutos e ${s} segundos`}>
        <span className="countdown__num">{h}</span>
        <span className="countdown__sep">:</span>
        <span className="countdown__num">{m}</span>
        <span className="countdown__sep">:</span>
        <span className="countdown__num">{s}</span>
      </div>
      <p className="countdown__sub">volte às 7h. o dia inteiro do Brasil, a mesma quest.</p>
    </section>
  );
}

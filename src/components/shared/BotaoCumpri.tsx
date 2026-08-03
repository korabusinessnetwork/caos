import { useState } from 'react';
import { ehUrlTikTokValida } from '../../lib/dominio/tiktok';
import './BotaoCumpri.css';

/**
 * Ação primária da tela: CUMPRI. Uma ação, sem fricção (princípio nº1).
 *  · Idempotente na UI: trava após o 1º clique até a resposta.
 *  · Campo opcional "colar link do TikTok" → concede o selo PROVADO.
 *  · Valida o link ANTES de enviar (prevenção > mensagem de erro).
 */
type Fase = 'idle' | 'enviando' | 'sucesso' | 'erro';

interface BotaoCumpriProps {
  onCumprir: (opts: { tiktokUrl: string | null }) => Promise<void>;
}

export function BotaoCumpri({ onCumprir }: BotaoCumpriProps) {
  const [fase, setFase] = useState<Fase>('idle');
  const [mostrarCampo, setMostrarCampo] = useState(false);
  const [link, setLink] = useState('');

  const linkLimpo = link.trim();
  const linkPreenchido = linkLimpo.length > 0;
  const linkInvalido = linkPreenchido && !ehUrlTikTokValida(linkLimpo);
  const travado = fase === 'enviando' || fase === 'sucesso';

  async function handleCumprir() {
    if (travado || linkInvalido) return;
    setFase('enviando');
    try {
      await onCumprir({ tiktokUrl: linkPreenchido ? linkLimpo : null });
      setFase('sucesso');
    } catch {
      setFase('erro');
    }
  }

  if (fase === 'sucesso') {
    return (
      <div className="cumpri cumpri--sucesso" role="status">
        <span className="cumpri__selo-ok">
          {linkPreenchido ? 'PROVADO' : 'CUMPRI'}
        </span>
        <p className="cumpri__msg">carta no álbum. streak +1. o caos registrou.</p>
      </div>
    );
  }

  return (
    <div className="cumpri">
      <button
        className="cumpri__botao"
        onClick={handleCumprir}
        disabled={travado || linkInvalido}
        aria-busy={fase === 'enviando'}
      >
        {fase === 'enviando' ? 'registrando…' : 'CUMPRI'}
      </button>

      {!mostrarCampo ? (
        <button
          className="cumpri__toggle"
          onClick={() => setMostrarCampo(true)}
          disabled={travado}
        >
          colar link do TikTok → virar PROVADO
        </button>
      ) : (
        <div className="cumpri__campo">
          <input
            type="url"
            inputMode="url"
            className={`cumpri__input${linkInvalido ? ' cumpri__input--erro' : ''}`}
            placeholder="https://tiktok.com/@voce/video/…"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={travado}
            aria-invalid={linkInvalido}
          />
          {linkInvalido && (
            <p className="cumpri__dica">precisa ser um link do TikTok.</p>
          )}
        </div>
      )}

      {fase === 'erro' && (
        <p className="cumpri__erro" role="alert">
          não rolou dessa vez. tenta de novo.
        </p>
      )}
    </div>
  );
}

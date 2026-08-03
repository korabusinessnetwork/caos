import { useState } from 'react';
import { ativarNotificacoes } from '../../lib/push';
import './OfertaPush.css';

interface OfertaPushProps {
  /** Chamado quando o usuário ativa OU dispensa a oferta (fecha o card). */
  onFechar: () => void;
}

/**
 * Oferta de notificação exibida logo após o 1º CUMPRI (fluxos.md) — o momento
 * de pico de motivação. Nunca é um muro: "agora não" fecha sem fricção. Uma
 * ação primária clara (princípio nº1). O texto vende os 4 toques, não a permissão.
 */
export function OfertaPush({ onFechar }: OfertaPushProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleAtivar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      await ativarNotificacoes();
      onFechar();
    } catch (e) {
      // Mensagem humana; nunca vaza detalhe técnico (princípio nº1 + segurança).
      setErro(
        e instanceof Error && e.message
          ? e.message
          : 'Não rolou ativar agora. Dá pra ligar depois no perfil.',
      );
      setEnviando(false);
    }
  };

  return (
    <div className="oferta-push" role="dialog" aria-label="Ativar notificações">
      <p className="oferta-push__titulo">quer que o caos te chame?</p>
      <p className="oferta-push__texto">
        te aviso quando a quest cair. sem isso, você perde o dia — e o streak.
      </p>

      {erro && (
        <p className="oferta-push__erro" role="alert">
          {erro}
        </p>
      )}

      <div className="oferta-push__acoes">
        <button
          type="button"
          className="oferta-push__ativar"
          onClick={handleAtivar}
          disabled={enviando}
        >
          {enviando ? 'ativando…' : 'me avisa'}
        </button>
        <button
          type="button"
          className="oferta-push__depois"
          onClick={onFechar}
          disabled={enviando}
        >
          agora não
        </button>
      </div>
    </div>
  );
}

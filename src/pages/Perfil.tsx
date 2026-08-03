import { useCallback, useEffect, useState } from 'react';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { PortaoAuth } from '../components/shared/PortaoAuth';
import { StreakBadge } from '../components/shared/StreakBadge';
import { FogoBadge } from '../components/shared/FogoBadge';
import { ExcluirConta } from '../components/shared/ExcluirConta';
import { ToggleRanking } from '../components/shared/ToggleRanking';
import { useAuth } from '../context/AuthContext';
import { useNavegacao } from '../context/NavegacaoContext';
import { tituloPorStreak } from '../lib/dominio/streak';
import { sair } from '../lib/auth';
import { buscarPerfil } from '../lib/perfil';
import { buscarStreak } from '../lib/streak';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_FOGOS, DEMO_PERFIL, DEMO_STREAK } from '../lib/demo';
import type { Fogo, Perfil as PerfilTipo } from '../lib/tipos';
import './Perfil.css';

function ConteudoPerfil() {
  const { modoDemo } = useAuth();
  const { irPara } = useNavegacao();
  const [estado, setEstado] = useState<Estado>('loading');
  const [perfil, setPerfil] = useState<PerfilTipo | null>(null);
  const [streakAtual, setStreakAtual] = useState(0);
  const [fogos, setFogos] = useState<Fogo[]>([]);
  const [compartilhado, setCompartilhado] = useState(false);

  const carregar = useCallback(async () => {
    setEstado('loading');
    if (MODO_DEMO) {
      setPerfil(DEMO_PERFIL);
      setStreakAtual(DEMO_STREAK.atual);
      setFogos(DEMO_FOGOS);
      setEstado('success');
      return;
    }
    try {
      const [p, s] = await Promise.all([buscarPerfil(), buscarStreak()]);
      setPerfil(p);
      setStreakAtual(s.atual);
      // Fogos ativos vêm da tabela fires (serviço no M4); por ora, sem lista.
      setFogos([]);
      setEstado('success');
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const titulo = tituloPorStreak(streakAtual);
  const nome = perfil?.username ?? 'agente';

  const compartilhar = async () => {
    const texto = `${streakAtual} dias no Caos. ${titulo ?? 'sem título ainda'}. cumpre você também?`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Caos Diário', text: texto });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        setCompartilhado(true);
        setTimeout(() => setCompartilhado(false), 2500);
      }
    } catch {
      /* usuário cancelou o compartilhamento — sem ação */
    }
  };

  const handleSair = async () => {
    if (modoDemo) return; // sem sessão real em demo
    try {
      await sair();
    } catch {
      /* falha ao sair não deve travar a tela */
    }
  };

  return (
    <EstadoTela
      estado={estado}
      onTentarNovamente={carregar}
      mensagemErro="não deu pra carregar seu perfil. tenta de novo."
    >
      <div className="perfil">
        <section className="perfil__card">
          <span className="perfil__watermark" aria-hidden="true">
            CAOS
          </span>
          <p className="perfil__nome">@{nome}</p>
          <StreakBadge streak={streakAtual} titulo={titulo} tamanho="compacto" />
        </section>

        <button type="button" className="perfil__compartilhar" onClick={compartilhar}>
          {compartilhado ? 'copiado ✓' : 'compartilhar meu caos'}
        </button>

        {/* Opt-in do ranking nacional (LGPD) — só no fluxo real. */}
        {!modoDemo && perfil && (
          <ToggleRanking inicial={perfil.rankingPublico} />
        )}

        <section className="perfil__secao">
          <h3 className="perfil__secao-titulo">fogos ativos</h3>
          {fogos.length > 0 ? (
            <div className="perfil__fogos">
              {fogos.map((f) => (
                <FogoBadge key={f.id} fogo={f} />
              ))}
            </div>
          ) : (
            <p className="perfil__vazio">
              nenhum fogo aceso. chame alguém pra segurar o caos com você.
            </p>
          )}
        </section>

        <nav className="perfil__links">
          <button type="button" className="perfil__link" onClick={() => irPara('arquivo')}>
            ver o caos que já passou →
          </button>
          {!modoDemo && (
            <button type="button" className="perfil__sair" onClick={handleSair}>
              sair
            </button>
          )}
        </nav>

        {/* Exclusão de conta (LGPD) — só no fluxo real, sem sessão em demo. */}
        {!modoDemo && <ExcluirConta />}
      </div>
    </EstadoTela>
  );
}

export function Perfil() {
  return (
    <PortaoAuth chamada="entre pra ver seu perfil.">
      <ConteudoPerfil />
    </PortaoAuth>
  );
}

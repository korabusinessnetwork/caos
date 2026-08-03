import { useCallback, useEffect, useState } from 'react';
import { CardDoCaos, type Selo } from '../components/shared/CardDoCaos';
import { BotaoCumpri } from '../components/shared/BotaoCumpri';
import { PayoffCumpri } from '../components/shared/PayoffCumpri';
import { ContadorSocial } from '../components/shared/ContadorSocial';
import { Countdown } from '../components/shared/Countdown';
import { EstadoTela, type Estado } from '../components/shared/EstadoTela';
import { Login } from '../components/shared/Login';
import { OfertaPush } from '../components/shared/OfertaPush';
import { useAuth } from '../context/AuthContext';
import { useNavegacao } from '../context/NavegacaoContext';
import { chaveDiaCaos, questRevelada } from '../lib/dominio/datas';
import { buscarQuestDoDia, jaCumpriu, marcarCumpri } from '../lib/quests';
import { permissaoAtual, pushSuportado } from '../lib/push';
import { supabaseConfigurado } from '../lib/supabase';
import { MODO_DEMO } from '../lib/ambiente';
import { DEMO_STREAK } from '../lib/demo';
import type { Quest, ResultadoCumpri } from '../lib/tipos';
import './QuestDoDia.css';

const QUEST_DEMO: Quest = {
  id: 'demo',
  dia: 47,
  hashtag: '#CaosDia47',
  titulo: 'O NARRADOR',
  comando: 'Narre em voz alta tudo que um estranho fizer por 1 minuto.',
  regra: 'Sem rir. Se rir, recomeça.',
  categoria: 'social',
  raridadeAlvo: 'rara',
  publicadaEm: null,
};

export function QuestDoDia() {
  const { autenticado } = useAuth();
  const { irPara } = useNavegacao();
  const [revelada, setRevelada] = useState(() => questRevelada(new Date()));
  const [estado, setEstado] = useState<Estado>('loading');
  const [quest, setQuest] = useState<Quest | null>(null);
  const [selo, setSelo] = useState<Selo>(null);
  const [contador, setContador] = useState<number | null>(null);
  const [pedindoLogin, setPedindoLogin] = useState(false);
  const [ofertarPush, setOfertarPush] = useState(false);
  const [payoff, setPayoff] = useState<ResultadoCumpri | null>(null);

  const carregar = useCallback(async () => {
    setEstado('loading');
    setSelo(null);

    if (MODO_DEMO) {
      setQuest(QUEST_DEMO);
      setContador(8412);
      setEstado('success');
      return;
    }

    if (!supabaseConfigurado) {
      setEstado('error');
      return;
    }

    try {
      const q = await buscarQuestDoDia(chaveDiaCaos(new Date()));
      if (!q) {
        setEstado('empty');
        return;
      }
      setQuest(q);
      setEstado('success');
      // Selo inicial: já cumpriu hoje? (não bloqueia a tela se falhar)
      try {
        if (await jaCumpriu(q.id)) setSelo('cumpri');
      } catch {
        /* estado do selo é secundário */
      }
    } catch {
      setEstado('error');
    }
  }, []);

  useEffect(() => {
    if (revelada) void carregar();
  }, [revelada, carregar]);

  // Após o CUMPRI (pico de motivação), oferece o push se ainda não foi decidido.
  const talvezOferecerPush = useCallback(() => {
    if (pushSuportado() && permissaoAtual() === 'default') setOfertarPush(true);
  }, []);

  const handleCumprir = useCallback(
    async ({ tiktokUrl }: { tiktokUrl: string | null }) => {
      if (MODO_DEMO) {
        await new Promise((r) => setTimeout(r, 650));
        const provado = tiktokUrl != null;
        // Resultado 100% local: streak base do demo +1, carta = a quest demo.
        const fabricado: ResultadoCumpri = {
          provado,
          streak: DEMO_STREAK.atual + 1,
          melhor: Math.max(DEMO_STREAK.melhor, DEMO_STREAK.atual + 1),
          ganhouCarta: true,
          carta: {
            nome: (quest ?? QUEST_DEMO).titulo,
            raridade: (quest ?? QUEST_DEMO).raridadeAlvo,
            temporada: 1,
            arteUrl: null,
            provado,
          },
        };
        setSelo(provado ? 'provado' : 'cumpri');
        setContador((c) => (c == null ? c : c + 1));
        setPayoff(fabricado);
        talvezOferecerPush();
        return;
      }
      if (!quest) throw new Error('Sem quest carregada.');
      const c = await marcarCumpri(quest.id, { tiktokUrl });
      setSelo(c.provado ? 'provado' : 'cumpri');
      setPayoff(c);
      talvezOferecerPush();
    },
    [quest, talvezOferecerPush],
  );

  // Antes das 7h: countdown, nunca tela vazia (princípio nº1).
  if (!revelada) {
    return (
      <div className="quest-dia quest-dia--espera">
        <Countdown onRevelou={() => setRevelada(true)} />
      </div>
    );
  }

  return (
    <div className="quest-dia">
      {MODO_DEMO && <p className="quest-dia__demo">modo demo · sem backend</p>}

      <EstadoTela
        estado={estado}
        onTentarNovamente={carregar}
        mensagemVazio="a quest de hoje ainda não caiu. volta já já."
        mensagemErro={
          supabaseConfigurado
            ? 'o caos travou. tenta de novo.'
            : 'backend não configurado (defina as chaves em .env.local).'
        }
      >
        {quest && (
          <div className="quest-dia__conteudo">
            <p className="quest-dia__chamada">a quest de hoje caiu.</p>

            <CardDoCaos
              dia={quest.dia}
              hashtag={quest.hashtag}
              titulo={quest.titulo}
              comando={quest.comando}
              regra={quest.regra}
              raridade={quest.raridadeAlvo}
              selo={selo}
            />

            {contador != null && (
              <ContadorSocial total={contador} jaCumpriu={selo != null} />
            )}

            {/* Login só quando for marcar CUMPRI (fluxos.md · atrito zero). */}
            {autenticado ? (
              <BotaoCumpri onCumprir={handleCumprir} />
            ) : pedindoLogin ? (
              <Login chamada="entre pra marcar CUMPRI e salvar seu caos." />
            ) : (
              <button
                type="button"
                className="quest-dia__cumpri-guest"
                onClick={() => setPedindoLogin(true)}
              >
                CUMPRI
              </button>
            )}

            {ofertarPush && (
              <OfertaPush onFechar={() => setOfertarPush(false)} />
            )}

            <button
              type="button"
              className="quest-dia__arquivo"
              onClick={() => irPara('arquivo')}
            >
              o caos que já passou →
            </button>
          </div>
        )}
      </EstadoTela>

      {payoff && (
        <PayoffCumpri
          resultado={payoff}
          questDia={quest?.dia ?? null}
          onFechar={() => setPayoff(null)}
        />
      )}
    </div>
  );
}

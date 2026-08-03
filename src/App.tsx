import type { ComponentType } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavegacaoProvider, useNavegacao, type Tela } from './context/NavegacaoContext';
import { NavInferior } from './components/shared/NavInferior';
import { QuestDoDia } from './pages/QuestDoDia';
import { Streak } from './pages/Streak';
import { AlbumDoCaos } from './pages/AlbumDoCaos';
import { Ranking } from './pages/Ranking';
import { ArquivoDoCaos } from './pages/ArquivoDoCaos';
import { Perfil } from './pages/Perfil';
import './App.css';

/** Mapa tela → componente. A rota inicial é 'hoje' (a Quest do Dia). */
const TELAS: Record<Tela, ComponentType> = {
  hoje: QuestDoDia,
  streak: Streak,
  album: AlbumDoCaos,
  ranking: Ranking,
  arquivo: ArquivoDoCaos,
  perfil: Perfil,
};

function Shell() {
  const { tela } = useNavegacao();
  const TelaAtual = TELAS[tela];

  return (
    <div className="app">
      <main className="app__conteudo">
        <TelaAtual />
      </main>
      <NavInferior />
    </div>
  );
}

/**
 * Shell do app. Providers globais (auth, navegação) + as 6 telas da v1. Sem
 * muro de login na entrada: abre já na Quest do Dia (fluxos.md). Navegação por
 * hash pra o "voltar" do celular funcionar e a tela sobreviver ao reload.
 */
export default function App() {
  return (
    <AuthProvider>
      <NavegacaoProvider>
        <Shell />
      </NavegacaoProvider>
    </AuthProvider>
  );
}

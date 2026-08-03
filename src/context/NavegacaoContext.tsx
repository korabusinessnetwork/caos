import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/**
 * Navegação por hash (`#/streak`). Sem lib de rota: 6 telas, app-shell PWA.
 * Usar o hash dá o botão "voltar" do navegador/celular de graça e mantém a
 * tela ao recarregar — atrito zero (princípio nº1).
 */
export type Tela =
  | 'hoje'
  | 'streak'
  | 'album'
  | 'ranking'
  | 'arquivo'
  | 'perfil';

const TELAS: readonly Tela[] = [
  'hoje',
  'streak',
  'album',
  'ranking',
  'arquivo',
  'perfil',
];
const PADRAO: Tela = 'hoje';

function lerHash(): Tela {
  const bruto = window.location.hash.replace(/^#\/?/, '');
  return (TELAS as readonly string[]).includes(bruto) ? (bruto as Tela) : PADRAO;
}

interface NavEstado {
  tela: Tela;
  irPara: (tela: Tela) => void;
}

const NavContext = createContext<NavEstado | null>(null);

export function NavegacaoProvider({ children }: { children: ReactNode }) {
  const [tela, setTela] = useState<Tela>(() => lerHash());

  useEffect(() => {
    const aoMudarHash = () => setTela(lerHash());
    window.addEventListener('hashchange', aoMudarHash);
    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  const irPara = (destino: Tela) => {
    if (destino !== lerHash()) window.location.hash = `/${destino}`;
    setTela(destino);
    window.scrollTo(0, 0);
  };

  return (
    <NavContext.Provider value={{ tela, irPara }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNavegacao(): NavEstado {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNavegacao precisa estar dentro de <NavegacaoProvider>.');
  return ctx;
}

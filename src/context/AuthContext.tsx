import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { aoMudarAuth, sessaoAtual } from '../lib/auth';
import { supabaseConfigurado } from '../lib/supabase';
import { MODO_DEMO } from '../lib/ambiente';

/**
 * Estado de autenticação global. O app NÃO tem muro de login na entrada
 * (fluxos.md: vê a quest na hora; login só ao marcar CUMPRI). `autenticado`
 * também é true em MODO_DEMO, pra a vitrine navegar sem backend.
 */
interface AuthEstado {
  sessao: Session | null;
  carregando: boolean;
  autenticado: boolean;
  modoDemo: boolean;
}

const AuthContext = createContext<AuthEstado | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!supabaseConfigurado) {
      // Sem backend: demo (dev) ou erro de config (prod). Nada a assinar.
      setCarregando(false);
      return;
    }

    let vivo = true;
    sessaoAtual()
      .then((s) => vivo && setSessao(s))
      .catch(() => vivo && setSessao(null))
      .finally(() => vivo && setCarregando(false));

    const cancelar = aoMudarAuth((_evento, s) => setSessao(s));
    return () => {
      vivo = false;
      cancelar();
    };
  }, []);

  const autenticado = MODO_DEMO || sessao != null;

  return (
    <AuthContext.Provider
      value={{ sessao, carregando, autenticado, modoDemo: MODO_DEMO }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthEstado {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}

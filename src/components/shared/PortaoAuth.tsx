import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EstadoTela } from './EstadoTela';
import { Login } from './Login';

/**
 * Portão das telas pessoais (streak/álbum/perfil). Não é muro de entrada do
 * app — a Quest do Dia é pública. Aqui: se ainda validando sessão → loading;
 * se logado (ou MODO_DEMO) → conteúdo; senão → login com a chamada de contexto.
 */
interface PortaoAuthProps {
  children: ReactNode;
  chamada?: string;
}

export function PortaoAuth({ children, chamada }: PortaoAuthProps) {
  const { carregando, autenticado } = useAuth();

  if (carregando) {
    return <EstadoTela estado="loading">{null}</EstadoTela>;
  }

  if (!autenticado) {
    return <Login chamada={chamada} />;
  }

  return <>{children}</>;
}

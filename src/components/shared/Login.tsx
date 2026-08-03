import { useState, type FormEvent } from 'react';
import { cadastrarComEmail, entrarComEmail } from '../../lib/auth';
import './Login.css';

/**
 * Entrar / cadastrar por e-mail. Aparece só quando o caos precisa ser salvo
 * (fluxos.md: login no 1º CUMPRI, ou ao abrir uma tela pessoal). Em sucesso, o
 * AuthProvider capta a mudança de sessão e troca a tela sozinho.
 *
 * Segurança: nunca logamos e-mail/senha. Erro do backend vira mensagem humana.
 */
type Modo = 'entrar' | 'cadastrar';

interface LoginProps {
  /** Frase de contexto ("entre pra marcar CUMPRI", "seu caos te espera"...). */
  chamada?: string;
}

const SENHA_MINIMA = 6;

export function Login({ chamada = 'entre pra salvar seu caos.' }: LoginProps) {
  const [modo, setModo] = useState<Modo>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setErro(null);
    setAviso(null);

    const emailLimpo = email.trim();
    if (!emailLimpo.includes('@')) {
      setErro('e-mail inválido.');
      return;
    }
    if (senha.length < SENHA_MINIMA) {
      setErro(`a senha precisa de ${SENHA_MINIMA}+ caracteres.`);
      return;
    }

    setEnviando(true);
    try {
      if (modo === 'entrar') {
        await entrarComEmail({ email: emailLimpo, senha });
      } else {
        const { session } = await cadastrarComEmail({ email: emailLimpo, senha });
        if (!session) {
          setAviso('confirme o e-mail que a gente mandou pra entrar.');
        }
      }
    } catch {
      setErro(
        modo === 'entrar'
          ? 'e-mail ou senha não bateram.'
          : 'não deu pra cadastrar. tenta outro e-mail.',
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="login">
      <p className="login__chamada">{chamada}</p>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <label className="login__campo">
          <span className="login__rotulo">e-mail</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className="login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={enviando}
          />
        </label>

        <label className="login__campo">
          <span className="login__rotulo">senha</span>
          <input
            type="password"
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            className="login__input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={enviando}
          />
        </label>

        {erro && <p className="login__erro" role="alert">{erro}</p>}
        {aviso && <p className="login__aviso" role="status">{aviso}</p>}

        <button type="submit" className="login__botao" disabled={enviando}>
          {enviando ? '...' : modo === 'entrar' ? 'ENTRAR' : 'CRIAR CONTA'}
        </button>
      </form>

      <button
        type="button"
        className="login__troca"
        onClick={() => {
          setModo((m) => (m === 'entrar' ? 'cadastrar' : 'entrar'));
          setErro(null);
          setAviso(null);
        }}
      >
        {modo === 'entrar'
          ? 'não tem conta? criar uma'
          : 'já tem conta? entrar'}
      </button>
    </section>
  );
}

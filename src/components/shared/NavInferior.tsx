import { useNavegacao, type Tela } from '../../context/NavegacaoContext';
import './NavInferior.css';

/**
 * Navegação inferior fixa — as abas primárias do app-shell. 5 destinos (o
 * arquivo é alcançado por links de contexto, pra não lotar a barra no celular).
 * Rótulos curtos e minúsculos: estética Atmosfera Viral, atrito zero.
 */
const ABAS: { tela: Tela; rotulo: string }[] = [
  { tela: 'hoje', rotulo: 'hoje' },
  { tela: 'streak', rotulo: 'streak' },
  { tela: 'album', rotulo: 'álbum' },
  { tela: 'ranking', rotulo: 'ranking' },
  { tela: 'perfil', rotulo: 'perfil' },
];

export function NavInferior() {
  const { tela, irPara } = useNavegacao();

  return (
    <nav className="nav-inf" aria-label="navegação principal">
      {ABAS.map((aba) => {
        const ativa = aba.tela === tela;
        return (
          <button
            key={aba.tela}
            type="button"
            className={`nav-inf__item ${ativa ? 'nav-inf__item--ativa' : ''}`}
            aria-current={ativa ? 'page' : undefined}
            onClick={() => irPara(aba.tela)}
          >
            <span className="nav-inf__ponto" aria-hidden="true" />
            {aba.rotulo}
          </button>
        );
      })}
    </nav>
  );
}

import './Header.scss';

const shortcuts = [
  { icon: 'package', label: 'Meus pedidos' },
  { icon: 'heart', label: 'Favoritos' },
  { icon: 'user', label: 'Minha conta' },
  { icon: 'cart', label: 'Carrinho' },
];

export default function Header() {
  return (
    <header className="site-header container" id="inicio">
      <ul className="site-header__benefits" aria-label="Vantagens da loja">
        <li>
          <img src="/images/icons/shield-check.svg" alt="" width="20" height="20" />
          <span>Compra <strong>100% segura</strong></span>
        </li>
        <li>
          <img src="/images/icons/truck.svg" alt="" width="20" height="20" />
          <span><strong>Frete grátis</strong> acima de R$ 200</span>
        </li>
        <li>
          <img src="/images/icons/credit-card.svg" alt="" width="20" height="20" />
          <span><strong>Parcele</strong> suas compras</span>
        </li>
      </ul>

      <div className="site-header__main">
        <a className="site-header__logo" href="/" aria-label="Econverse — página inicial">
          <img src="/images/icons/logo.svg" alt="Econverse" width="139" height="42" />
        </a>

        <div className="site-header__search" role="search" aria-label="Busca de produtos">
          <label className="visually-hidden" htmlFor="product-search">Buscar produtos</label>
          <input
            id="product-search"
            type="search"
            placeholder="O que você está buscando?"
            disabled
          />
          <button type="button" aria-label="Buscar" disabled>
            <img src="/images/icons/search.svg" alt="" width="28" height="28" />
          </button>
        </div>

        <div className="site-header__shortcuts" aria-label="Atalhos da loja">
          {shortcuts.map(({ icon, label }) => (
            <button key={icon} type="button" aria-label={label} disabled>
              <img src={`/images/icons/${icon}.svg`} alt="" width="32" height="32" />
            </button>
          ))}
        </div>
      </div>

      <nav className="site-header__nav" aria-label="Navegação principal">
        <ul>
          <li><a href="#categorias">Todas categorias</a></li>
          <li><a href="#categoria-supermercado">Supermercado</a></li>
          <li><button type="button" disabled>Livros</button></li>
          <li><a href="#categoria-moda">Moda</a></li>
          <li><button type="button" disabled>Lançamentos</button></li>
          <li><a className="site-header__offer" href="#promocoes">Ofertas do dia</a></li>
          <li>
            <button className="site-header__subscription" type="button" disabled>
              <img src="/images/icons/crown.svg" alt="" width="20" height="20" />
              Assinatura
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

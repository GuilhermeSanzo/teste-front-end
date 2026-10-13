import './Footer.scss';

const columns = [
  { title: 'Institucional', items: ['Sobre Nós', 'Movimento', 'Trabalhe conosco'] },
  { title: 'Ajuda', items: ['Suporte', 'Fale Conosco', 'Perguntas Frequentes'] },
  { title: 'Termos', items: ['Termos e Condições', 'Política de Privacidade', 'Troca e Devolução'] },
];

const socialNetworks = [
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Facebook', icon: 'facebook' },
  { name: 'LinkedIn', icon: 'linkedin' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <a href="#inicio" aria-label="Econverse — voltar ao início">
            <img src="/images/icons/logo-footer.svg" alt="" width="164" height="48" />
          </a>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <ul className="footer__social" aria-label="Redes sociais">
            {socialNetworks.map(({ name, icon }) => (
              <li key={name}>
                <img src={`/images/icons/${icon}.svg`} alt={name} width="24" height="24" />
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__columns">
          {columns.map(({ title, items }) => (
            <div className="footer__column" key={title}>
              <h2>{title}</h2>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="footer__bottom">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </footer>
  );
}

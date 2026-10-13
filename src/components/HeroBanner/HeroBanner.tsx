import './HeroBanner.scss';

export default function HeroBanner() {
  return (
    <section className="hero-banner" id="promocoes" aria-labelledby="hero-title">
      <div className="hero-banner__content container">
        <h1 id="hero-title">Venha conhecer nossas<br />promoções</h1>
        <p><strong>50% Off</strong> nos produtos</p>
        <a className="hero-banner__button" href="#produtos">Ver produto</a>
      </div>
    </section>
  );
}

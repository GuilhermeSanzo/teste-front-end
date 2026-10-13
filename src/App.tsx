import Categories from './components/Categories/Categories';
import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <HeroBanner />
        <Categories />
      </main>
    </>
  );
}

import { useEffect, useState } from 'react';
import Categories from './components/Categories/Categories';
import BrandShelf from './components/BrandShelf/BrandShelf';
import CatalogSection from './components/CatalogSection/CatalogSection';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';
import Newsletter from './components/Newsletter/Newsletter';
import PartnerBanners from './components/PartnerBanners/PartnerBanners';
import ProductModal from './components/ProductModal/ProductModal';
import { loadProducts } from './services/products';
import type { Product } from './types/product';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    async function fetchProducts() {
      try {
        const loadedProducts = await loadProducts(controller.signal);
        // Ignora respostas de uma consulta cancelada ao sair da página ou tentar novamente.
        if (!controller.signal.aborted) setProducts(loadedProducts);
      } catch {
        if (!controller.signal.aborted) {
          setError('Não foi possível carregar os produtos. Tente novamente.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void fetchProducts();
    return () => controller.abort();
  }, [attempt]);

  const catalogProps = {
    products,
    isLoading,
    error,
    onRetry: () => setAttempt((current) => current + 1),
    onSelectProduct: setSelectedProduct,
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <HeroBanner />
        <Categories />
        <CatalogSection id="produtos" announceStatus {...catalogProps} />
        <PartnerBanners destination="#produtos-destaque" />
        <CatalogSection id="produtos-destaque" variant="view-all" {...catalogProps} />
        <PartnerBanners destination="#produtos-marcas" />
        <BrandShelf destination="#produtos-marcas" />
        <CatalogSection id="produtos-marcas" variant="view-all" {...catalogProps} />
        <Newsletter />
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.productName}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

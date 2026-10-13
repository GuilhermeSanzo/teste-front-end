import { useEffect, useState } from 'react';
import Categories from './components/Categories/Categories';
import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';
import ProductShelf from './components/ProductShelf/ProductShelf';
import ProductModal from './components/ProductModal/ProductModal';
import { loadProducts } from './services/products';
import type { Product } from './types/product';
import './styles/catalog.scss';

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

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <HeroBanner />
        <Categories />
        <div className="product-catalog" id="produtos" aria-busy={isLoading}>
          {isLoading ? (
            <p className="product-catalog__message container" role="status">Carregando produtos…</p>
          ) : error ? (
            <div className="product-catalog__message container" role="alert">
              <p>{error}</p>
              <button
                className="product-catalog__retry"
                type="button"
                onClick={() => setAttempt((current) => current + 1)}
              >
                Tentar novamente
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="product-catalog__message container" role="status">Nenhum produto disponível.</p>
          ) : (
            <ProductShelf products={products} onSelectProduct={setSelectedProduct} />
          )}
        </div>
      </main>
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

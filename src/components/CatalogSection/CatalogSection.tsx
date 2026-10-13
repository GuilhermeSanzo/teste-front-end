import type { Product } from '../../types/product';
import ProductShelf from '../ProductShelf/ProductShelf';
import type { ShelfVariant } from '../ProductShelf/ProductShelf';
import '../../styles/catalog.scss';

type CatalogSectionProps = {
  id: string;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectProduct: (product: Product) => void;
  variant?: ShelfVariant;
  announceStatus?: boolean;
};

export default function CatalogSection({
  id, products, isLoading, error, onRetry, onSelectProduct,
  variant = 'categories', announceStatus = false,
}: CatalogSectionProps) {
  return (
    <div className="product-catalog" id={id} aria-busy={isLoading}>
      {isLoading ? (
        <p className="product-catalog__message container" role={announceStatus ? 'status' : undefined}>
          Carregando produtos…
        </p>
      ) : error ? (
        <div className="product-catalog__message container" role={announceStatus ? 'alert' : undefined}>
          <p>{error}</p>
          <button className="product-catalog__retry" type="button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      ) : products.length === 0 ? (
        <p className="product-catalog__message container" role={announceStatus ? 'status' : undefined}>
          Nenhum produto disponível.
        </p>
      ) : (
        <ProductShelf products={products} onSelectProduct={onSelectProduct} variant={variant} />
      )}
    </div>
  );
}

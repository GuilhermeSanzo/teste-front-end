import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import './ProductCard.scss';

type ProductCardProps = {
  product: Product;
  onSelectProduct: (product: Product) => void;
};

export default function ProductCard({ product, onSelectProduct }: ProductCardProps) {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.photo}
        alt={product.productName}
        width="278"
        height="228"
        loading="lazy"
      />
      <h3 className="product-card__name">{product.productName}</h3>
      <p className="product-card__price">{formatPrice(product.price)}</p>
      <button
        className="product-card__button"
        type="button"
        aria-label={`Comprar ${product.productName}`}
        aria-haspopup="dialog"
        onClick={() => onSelectProduct(product)}
      >
        Comprar
      </button>
    </article>
  );
}

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';
import './ProductShelf.scss';

export type ShelfVariant = 'categories' | 'view-all';

type ProductShelfProps = {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  id?: string;
  variant?: ShelfVariant;
};

const categories = ['Celular', 'Acessórios', 'Tablets', 'Notebooks', 'TVs', 'Ver todos'];

function getNavigation(list: HTMLUListElement) {
  return {
    previous: list.scrollLeft > 1,
    next: list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
  };
}

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export default function ProductShelf({ products, onSelectProduct, id, variant = 'categories' }: ProductShelfProps) {
  const titleId = useId();
  const listId = useId();
  const instructionsId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const [navigation, setNavigation] = useState({ previous: false, next: false });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const updateNavigation = () => setNavigation(getNavigation(list));
    const observer = new ResizeObserver(updateNavigation);
    observer.observe(list);
    updateNavigation();

    return () => observer.disconnect();
  }, [products, expanded]);

  function moveCards(direction: -1 | 1) {
    const list = listRef.current;
    const firstCard = list?.firstElementChild;
    if (!list || !firstCard) return;

    // Calcula o passo com as medidas atuais para acompanhar o layout responsivo.
    const gap = Number.parseFloat(getComputedStyle(list).columnGap);
    const distance = firstCard.getBoundingClientRect().width + gap;
    list.scrollBy({ left: distance * direction, behavior: getScrollBehavior() });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (expanded || event.target !== event.currentTarget) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveCards(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      event.currentTarget.scrollTo({
        left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
        behavior: getScrollBehavior(),
      });
    }
  }

  return (
    <section className={`product-shelf product-shelf--${variant} container`} id={id} aria-labelledby={titleId}>
      <h2 className="product-shelf__title" id={titleId}>Produtos relacionados</h2>

      {variant === 'categories' ? (
        <ul className="product-shelf__categories" aria-label="Categorias de produtos">
          {categories.map((category, index) => (
            <li key={category}>
              <button
                className={index === 0 ? 'product-shelf__category--active' : undefined}
                type="button"
                disabled
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <button
          className="product-shelf__view-all"
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Ver menos' : 'Ver todos'}
        </button>
      )}

      {!expanded && (
        <p className="visually-hidden" id={instructionsId}>
          Use as setas esquerda e direita para navegar pelos produtos. Home vai ao início e End ao fim.
        </p>
      )}

      <div className="product-shelf__carousel">
        <ul
          className={`product-shelf__list${expanded ? ' product-shelf__list--expanded' : ''}`}
          id={listId}
          ref={listRef}
          tabIndex={expanded ? undefined : 0}
          aria-label="Lista de produtos"
          aria-describedby={expanded ? undefined : instructionsId}
          onKeyDown={handleKeyDown}
          onScroll={(event) => setNavigation(getNavigation(event.currentTarget))}
        >
          {products.map((product) => (
            <li className="product-shelf__item" key={product.productName}>
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </li>
          ))}
        </ul>

        {!expanded && (
          <>
            <button
              className="product-shelf__arrow product-shelf__arrow--previous"
              type="button"
              aria-label="Produtos anteriores"
              aria-controls={listId}
              disabled={!navigation.previous}
              onClick={() => moveCards(-1)}
            >
              <img src="/images/icons/arrow-left.svg" alt="" width="40" height="40" />
            </button>
            <button
              className="product-shelf__arrow product-shelf__arrow--next"
              type="button"
              aria-label="Próximos produtos"
              aria-controls={listId}
              disabled={!navigation.next}
              onClick={() => moveCards(1)}
            >
              <img src="/images/icons/arrow-right.svg" alt="" width="40" height="40" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

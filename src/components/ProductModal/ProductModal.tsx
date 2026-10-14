import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import './ProductModal.scss';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

function isOutsideDialog(event: MouseEvent<HTMLDialogElement> | PointerEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return false;

  // O fundo e o espaço interno podem ter o dialog como alvo; as coordenadas distinguem os dois.
  const bounds = event.currentTarget.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right
    || event.clientY < bounds.top || event.clientY > bounds.bottom;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startedOutside = useRef(false);
  const [quantity, setQuantity] = useState(1);
  const [confirmedQuantity, setConfirmedQuantity] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  function closeModal() {
    dialogRef.current?.close();
  }

  function changeQuantity(change: -1 | 1) {
    setQuantity((current) => Math.max(1, current + change));
    setConfirmedQuantity(null);
  }

  function keepFocusInDialog(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;

    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog
      className="product-modal"
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
      onKeyDown={keepFocusInDialog}
      onPointerDown={(event) => { startedOutside.current = isOutsideDialog(event); }}
      onClick={(event) => {
        // Fecha apenas se o gesto começou e terminou no fundo, evitando fechar ao arrastar de dentro.
        if (startedOutside.current && isOutsideDialog(event)) closeModal();
        startedOutside.current = false;
      }}
    >
      <button
        className="product-modal__close"
        type="button"
        aria-label="Fechar detalhes do produto"
        autoFocus
        onClick={closeModal}
      />

      <div className="product-modal__layout">
        <img
          className="product-modal__image"
          src={product.photo}
          alt={product.productName}
          width="247"
          height="192"
        />

        <div className="product-modal__content">
          <div className="product-modal__summary">
            <h2 className="product-modal__name" id={titleId}>{product.productName}</h2>
            <p className="product-modal__price">{formatPrice(product.price)}</p>
          </div>

          <p className="product-modal__description" id={descriptionId}>{product.descriptionShort}</p>

          <div className="product-modal__actions">
            <div className="product-modal__quantity" role="group" aria-label="Quantidade do produto">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={quantity === 1}
                onClick={() => changeQuantity(-1)}
              >
                <img src="/images/icons/minus.svg" alt="" width="21" height="20" />
              </button>
              <output aria-label="Quantidade" aria-live="polite">{String(quantity).padStart(2, '0')}</output>
              <button type="button" aria-label="Aumentar quantidade" onClick={() => changeQuantity(1)}>
                <img src="/images/icons/plus.svg" alt="" width="21" height="20" />
              </button>
            </div>

            <button className="product-modal__buy" type="button" onClick={() => setConfirmedQuantity(quantity)}>
              Comprar
            </button>
          </div>

          {confirmedQuantity !== null && (
            <p className="product-modal__confirmation" role="status">
              Você selecionou {confirmedQuantity} {confirmedQuantity === 1 ? 'unidade' : 'unidades'} de {product.productName}.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}

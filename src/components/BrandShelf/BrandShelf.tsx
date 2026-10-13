import { useId } from 'react';
import './BrandShelf.scss';

type BrandShelfProps = {
  destination: string;
};

export default function BrandShelf({ destination }: BrandShelfProps) {
  const titleId = useId();

  return (
    <section className="brand-shelf container" aria-labelledby={titleId}>
      <h2 id={titleId}>Navegue por marcas</h2>
      <ul>
        {[1, 2, 3, 4, 5].map((position) => (
          <li key={position}>
            <a href={destination} aria-label={`Ver produtos Econverse — destaque ${position}`}>
              <img src="/images/icons/logo-brand.svg" alt="" width="117" height="35" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

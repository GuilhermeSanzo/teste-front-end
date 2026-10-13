import { useId } from 'react';
import './PartnerBanners.scss';

type PartnerBannersProps = {
  destination: string;
};

export default function PartnerBanners({ destination }: PartnerBannersProps) {
  const titleId = useId();

  return (
    <section className="partner-banners container" aria-labelledby={titleId}>
      <h2 className="visually-hidden" id={titleId}>Parceiros</h2>
      {[1, 2].map((position) => (
        <article className="partner-banners__card" key={position}>
          <div className="partner-banners__content">
            <h3>Parceiros</h3>
            <p>Lorem ipsum dolor sit amet, consectetur</p>
            <a href={destination}>Confira</a>
          </div>
        </article>
      ))}
    </section>
  );
}

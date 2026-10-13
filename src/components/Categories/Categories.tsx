import './Categories.scss';

const categories = [
  { id: 'tecnologia', name: 'Tecnologia', image: 'technology' },
  { id: 'supermercado', name: 'Supermercado', image: 'supermarket' },
  { id: 'bebidas', name: 'Bebidas', image: 'drinks' },
  { id: 'ferramentas', name: 'Ferramentas', image: 'tools' },
  { id: 'saude', name: 'Saúde', image: 'health' },
  { id: 'esportes', name: 'Esportes e Fitness', image: 'sports' },
  { id: 'moda', name: 'Moda', image: 'fashion' },
];

export default function Categories() {
  return (
    <section className="categories container" id="categorias" aria-labelledby="categories-title">
      <h2 className="visually-hidden" id="categories-title">Compre por categoria</h2>
      <ul className="categories__list">
        {categories.map(({ id, name, image }) => (
          <li className="categories__item" id={`categoria-${id}`} key={id}>
            <div className={`categories__image${id === 'tecnologia' ? ' categories__image--featured' : ''}`}>
              <img src={`/images/categories/${image}.png`} alt="" width="61" height="61" />
            </div>
            <span className={id === 'tecnologia' ? 'categories__name--featured' : undefined}>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { testProducts } from '../../test/products';
import ProductShelf from './ProductShelf';

describe('expansão das vitrines', () => {
  it('expande e recolhe cada vitrine de forma independente', async () => {
    const user = userEvent.setup();
    render(<>
      <ProductShelf products={testProducts} onSelectProduct={vi.fn()} variant="view-all" />
      <ProductShelf products={testProducts} onSelectProduct={vi.fn()} variant="view-all" />
    </>);
    const shelves = screen.getAllByRole('region', { name: 'Produtos relacionados' });
    const first = within(shelves[0]);
    const second = within(shelves[1]);
    const firstList = first.getByRole('list', { name: 'Lista de produtos' });
    const secondList = second.getByRole('list', { name: 'Lista de produtos' });
    expect(firstList.id).not.toBe(secondList.id);
    const expand = first.getByRole('button', { name: 'Ver todos' });
    expect(expand.getAttribute('aria-controls')).toBe(firstList.id);
    await user.click(expand);
    expect(first.getByRole('button', { name: 'Ver menos' }).getAttribute('aria-expanded')).toBe('true');
    expect(first.queryByRole('button', { name: 'Próximos produtos' })).toBeNull();
    expect(second.getByRole('button', { name: 'Ver todos' }).getAttribute('aria-expanded')).toBe('false');
    expect(first.getAllByRole('article')).toHaveLength(testProducts.length);
    await user.click(first.getByRole('button', { name: 'Ver menos' }));
    expect(first.getByRole('button', { name: 'Ver todos' }).getAttribute('aria-expanded')).toBe('false');
    expect(first.getByRole('button', { name: 'Próximos produtos' })).toBeTruthy();
  });
});

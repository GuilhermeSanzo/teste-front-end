import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { testProducts } from '../../test/products';
import ProductModal from './ProductModal';

describe('detalhes e quantidade do produto', () => {
  it('limita a quantidade a um e confirma a quantidade escolhida sem alterar o preço unitário', async () => {
    const user = userEvent.setup();
    render(<ProductModal product={testProducts[1]} onClose={vi.fn()} />);
    const modal = screen.getByRole('dialog', { name: 'Produto B' });
    const decrease = within(modal).getByRole('button', { name: 'Diminuir quantidade' });
    const increase = within(modal).getByRole('button', { name: 'Aumentar quantidade' });
    const quantity = within(modal).getByLabelText('Quantidade');
    expect((decrease as HTMLButtonElement).disabled).toBe(true);
    await user.click(decrease);
    expect(quantity.textContent).toBe('01');
    await user.click(increase);
    await user.click(increase);
    await user.click(decrease);
    expect(quantity.textContent).toBe('02');
    expect(within(modal).getByText('R$ 200,00')).toBeTruthy();
    await user.click(within(modal).getByRole('button', { name: /^Comprar$/ }));
    expect(within(modal).getByText('Você selecionou 2 unidades de Produto B.')).toBeTruthy();
    await user.click(decrease);
    expect(within(modal).queryByText('Você selecionou 2 unidades de Produto B.')).toBeNull();
    expect(quantity.textContent).toBe('01');
    expect((decrease as HTMLButtonElement).disabled).toBe(true);
  });

  it('restaura os estilos de rolagem anteriores ao desmontar', () => {
    document.body.style.overflow = 'scroll';
    document.documentElement.style.scrollbarGutter = 'auto';
    const { unmount } = render(<ProductModal product={testProducts[0]} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.documentElement.style.scrollbarGutter).toBe('auto');
    document.body.style.overflow = '';
    document.documentElement.style.scrollbarGutter = '';
  });
});

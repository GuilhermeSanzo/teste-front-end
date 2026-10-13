import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { loadProducts } from './services/products';
import { testProducts } from './test/products';
import type { Product } from './types/product';

vi.mock('./services/products', () => ({ loadProducts: vi.fn() }));
const loadMock = vi.mocked(loadProducts);

beforeEach(() => { loadMock.mockReset(); });

describe('catálogo na Home', () => {
  it('mostra carregamento e compartilha uma consulta entre três vitrines', async () => {
    let resolveProducts!: (products: Product[]) => void;
    loadMock.mockReturnValue(new Promise((resolve) => { resolveProducts = resolve; }));
    render(<App />);
    expect(screen.getAllByText('Carregando produtos…')).toHaveLength(3);
    expect(screen.getAllByRole('status')).toHaveLength(1);

    await act(async () => resolveProducts(testProducts));
    const lists = screen.getAllByRole('list', { name: 'Lista de produtos' });
    expect(lists).toHaveLength(3);
    for (const list of lists) expect(within(list).getAllByRole('article')).toHaveLength(2);
    expect(loadMock).toHaveBeenCalledTimes(1);
  });

  it('permite recuperar as três vitrines após falha, sem repetir o alerta', async () => {
    loadMock.mockRejectedValueOnce(new Error('Falha de rede')).mockResolvedValueOnce(testProducts);
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('alert');
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    await user.click(screen.getAllByRole('button', { name: 'Tentar novamente' })[2]);
    await screen.findAllByRole('button', { name: 'Comprar Produto B' });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(loadMock).toHaveBeenCalledTimes(2);
    expect(loadMock.mock.calls[0][0].aborted).toBe(true);
  });

  it('informa catálogo vazio sem mostrar cards', async () => {
    loadMock.mockResolvedValue([]);
    render(<App />);
    await screen.findAllByText('Nenhum produto disponível.');
    expect(screen.queryByRole('button', { name: /^Comprar / })).toBeNull();
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('abre o produto clicado em qualquer vitrine e reinicia a quantidade ao reabrir', async () => {
    loadMock.mockResolvedValue(testProducts);
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('button', { name: 'Comprar Produto B' });

    for (let shelf = 0; shelf < 3; shelf += 1) {
      const product = testProducts[shelf === 1 ? 0 : 1];
      await user.click(screen.getAllByRole('button', { name: `Comprar ${product.productName}` })[shelf]);
      const modal = screen.getByRole('dialog', { name: product.productName });
      expect(within(modal).getByText(product.descriptionShort)).toBeTruthy();
      expect(within(modal).getByText(product.price === 100 ? 'R$ 100,00' : 'R$ 200,00')).toBeTruthy();
      expect(within(modal).getByLabelText('Quantidade').textContent).toBe('01');
      await user.click(within(modal).getByRole('button', { name: 'Aumentar quantidade' }));
      await user.click(within(modal).getByRole('button', { name: 'Fechar detalhes do produto' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
  });

  it('cancela a consulta ao desmontar a página', () => {
    loadMock.mockReturnValue(new Promise(() => {}));
    const { unmount } = render(<App />);
    const signal = loadMock.mock.calls[0][0];
    unmount();
    expect(signal.aborted).toBe(true);
  });
});

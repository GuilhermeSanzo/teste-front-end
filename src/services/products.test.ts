import { beforeEach, describe, expect, it, vi } from 'vitest';
import { testProducts } from '../test/products';
import { loadProducts } from './products';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

function respond(data: unknown) {
  fetchMock.mockResolvedValue(new Response(JSON.stringify(data)));
}

function load() {
  return loadProducts(new AbortController().signal);
}

describe('loadProducts', () => {
  it('retorna os dados válidos sem alterar preços ou campos', async () => {
    respond({ success: true, products: testProducts });
    expect(await load()).toEqual(testProducts);
    expect(fetchMock.mock.calls[0][0]).toBe('/data/products.json');
  });

  it('aceita um catálogo vazio', async () => {
    respond({ success: true, products: [] });
    expect(await load()).toEqual([]);
  });

  it('recusa erro HTTP mesmo com corpo aparentemente válido', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, products: testProducts }), { status: 503 }));
    await expect(load()).rejects.toThrow('Não foi possível carregar os produtos.');
  });

  it('propaga a falha de rede', async () => {
    fetchMock.mockRejectedValue(new TypeError('Falha de conexão'));
    await expect(load()).rejects.toThrow('Falha de conexão');
  });

  it('recusa JSON malformado', async () => {
    fetchMock.mockResolvedValue(new Response('{'));
    await expect(load()).rejects.toThrow();
  });

  it.each([
    null,
    { success: false, products: testProducts },
    { success: true, products: {} },
    { success: true, products: [null] },
    { success: true, products: [{ ...testProducts[0], productName: ' ' }] },
    { success: true, products: [{ ...testProducts[0], descriptionShort: 42 }] },
    { success: true, products: [{ ...testProducts[0], photo: 'javascript:alert(1)' }] },
    { success: true, products: [{ ...testProducts[0], price: '100' }] },
    { success: true, products: [{ ...testProducts[0], price: -1 }] },
    { success: true, products: [{ ...testProducts[0], price: null }] },
  ])('recusa estrutura ou campos inválidos: %j', async (data) => {
    respond(data);
    await expect(load()).rejects.toThrow('formato inválido');
  });

  it('recusa nomes repetidos para não confundir a identidade dos cards', async () => {
    respond({ success: true, products: [testProducts[0], testProducts[0]] });
    await expect(load()).rejects.toThrow('nomes de produto repetidos');
  });

  it('repassa o cancelamento para a requisição pendente', async () => {
    fetchMock.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener('abort', () => reject(options.signal?.reason), { once: true });
    }));
    const controller = new AbortController();
    const pending = loadProducts(controller.signal);
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await rejected;
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });
});

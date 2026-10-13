import type { Product } from '../types/product';

function isProduct(value: unknown): value is Product {
  if (value === null || typeof value !== 'object') return false;

  return 'productName' in value
    && typeof value.productName === 'string' && value.productName.trim().length > 0
    && 'descriptionShort' in value && typeof value.descriptionShort === 'string'
    && 'photo' in value && typeof value.photo === 'string' && /^https?:\/\//.test(value.photo)
    && 'price' in value && typeof value.price === 'number'
    && Number.isFinite(value.price) && value.price >= 0;
}

export async function loadProducts(signal: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/products.json`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
    cache: 'no-cache',
  });

  if (!response.ok) throw new Error('Não foi possível carregar os produtos.');

  const data: unknown = await response.json();

  if (data === null || typeof data !== 'object'
    || !('success' in data) || data.success !== true
    || !('products' in data) || !Array.isArray(data.products)
    || !data.products.every(isProduct)) {
    throw new Error('O catálogo recebido está em um formato inválido.');
  }

  const names = data.products.map((product) => product.productName);
  if (new Set(names).size !== names.length) {
    throw new Error('O catálogo contém nomes de produto repetidos.');
  }

  return data.products;
}

import { mkdir, rename, writeFile } from 'node:fs/promises';

const source = 'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json';
const directory = new URL('../public/data/', import.meta.url);
const destination = new URL('products.json', directory);
const temporaryFile = new URL('products.json.tmp', directory);

function isProduct(product) {
  return product !== null
    && typeof product === 'object'
    && typeof product.productName === 'string' && product.productName.trim().length > 0
    && typeof product.descriptionShort === 'string'
    && typeof product.photo === 'string' && /^https?:\/\//.test(product.photo)
    && typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0;
}

try {
  const response = await fetch(source, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) throw new Error(`A fonte respondeu com HTTP ${response.status}.`);

  const content = await response.text();
  const data = JSON.parse(content);

  if (data?.success !== true || !Array.isArray(data.products) || !data.products.every(isProduct)) {
    throw new Error('O JSON oficial não contém um catálogo válido.');
  }

  const names = data.products.map((product) => product.productName);
  if (new Set(names).size !== names.length) {
    throw new Error('O catálogo contém nomes de produto repetidos.');
  }

  await mkdir(directory, { recursive: true });
  // Substitui o catálogo apenas depois de gravar toda a resposta no arquivo temporário.
  await writeFile(temporaryFile, content, 'utf8');
  await rename(temporaryFile, destination);
  console.log(`Catálogo oficial sincronizado: ${data.products.length} produtos.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Falha ao sincronizar o catálogo oficial: ${message}`);
  console.error(`Fonte: ${source}`);
  process.exitCode = 1;
}

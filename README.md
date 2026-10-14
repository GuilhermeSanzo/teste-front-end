# Econverse — Teste Front-end

Página desenvolvida para o desafio técnico da Econverse, utilizando React, TypeScript, Sass e Vite, sem bibliotecas de UI. A referência visual são as telas Home e Popup do Figma, com a paleta azul e amarela.

## Requisitos

- Node.js 22, a partir da versão 22.12, e npm 10 ou superior.
- Acesso à internet para instalar dependências, sincronizar o catálogo e carregar as imagens dos produtos.

Ambiente validado: Node.js 22.21.1 e npm 10.9.4. Não há variáveis de ambiente obrigatórias.

## Instalação e desenvolvimento

```bash
git clone https://github.com/GuilhermeSanzo/teste-front-end.git
cd teste-front-end
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Use `Ctrl+C` para encerrar o servidor. Para executar outros comandos enquanto ele estiver ativo, abra outro terminal na pasta do projeto.

## Testes e verificação de tipos

| Comando | Finalidade |
| --- | --- |
| `npm test` | Executa a suíte de testes uma vez. |
| `npm run test:watch` | Acompanha alterações e executa os testes novamente. |
| `npm run typecheck` | Verifica os tipos com TypeScript. |

Os testes usam Vitest, Testing Library e jsdom, com respostas controladas para o catálogo. Cobrem validação dos dados, carregamento, erro e nova tentativa, seleção de produtos, quantidade no modal, expansão das vitrines e validação da newsletter. Depois de instalar as dependências, não precisam acessar a fonte externa.

Layout, rolagem, foco e fechamento nativo do modal também foram conferidos no Chromium, com larguras de tela simuladas entre 320 e 1440 px.

## Compilação e prévia local

```bash
npm run build
npm run preview
```

O build verifica os tipos e gera os arquivos de produção em `dist/`. O comando `preview` serve essa compilação localmente, normalmente em `http://localhost:4173`.

## Catálogo de produtos

O [JSON oficial](https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json) é sincronizado automaticamente antes de `npm run dev` e `npm run build`, por meio de `scripts/sync-products.mjs`. O script valida a resposta e salva seu conteúdo em `public/data/products.json`, sem alterar os produtos.

O navegador consulta esse arquivo na mesma origem da aplicação, evitando depender da permissão de CORS da fonte externa. O arquivo gerado é ignorado pelo Git e incluído no build. Falhas de rede ou dados inválidos interrompem a sincronização e impedem o início do dev/build.

Em produção, o catálogo corresponde à última compilação. Atualizar os produtos publicados exige um novo build. A sincronização também pode ser executada manualmente com `npm run sync:products`.

A interface trata carregamento, catálogo vazio e falha de consulta, com opção de tentar novamente. Os preços são exibidos em reais, usando os valores numéricos fornecidos pelo JSON.

## Interações e decisões

- As três vitrines compartilham a mesma consulta de produtos e um único modal. Cada carrossel tem rolagem independente; nas duas últimas vitrines, “Ver todos” expande os produtos em uma grade e “Ver menos” retorna ao carrossel.
- Clicar em um card abre os dados do produto selecionado. O modal permite ajustar a quantidade, com mínimo de uma unidade, e confirmar a seleção localmente. Fecha pelo botão, por Escape ou pelo fundo, devolvendo o foco ao card. Não há criação de pedido, carrinho ou pagamento.
- A newsletter valida nome, e-mail e aceite dos termos. A resposta informa que os dados foram validados, sem realizar inscrição, enviar informações ou persistir os campos.
- A fonte não fornece categorias, ids, preço anterior, parcelamento, frete ou URL de detalhes. Essas informações comerciais não foram inventadas. Os nomes únicos, validados no carregamento, identificam os produtos; as imagens repetidas seguem os endereços fornecidos pelo JSON.
- Os rótulos de categoria da primeira vitrine e os atalhos sem funcionalidade permanecem desabilitados. Banners e marcas usam âncoras internas; itens institucionais e sociais sem URL fornecida são informativos.
- A página utiliza HTML semântico, rótulos acessíveis, foco visível, navegação por teclado e título/descrição para SEO básico.

## Organização

```text
scripts/          Sincronização do catálogo oficial
public/           Imagens, fontes e catálogo gerado
src/components/   Componentes da página e seus estilos Sass
src/services/     Consulta e validação dos produtos
src/types/        Tipos dos dados
src/utils/        Formatação de preços
src/styles/       Estilos globais e variáveis Sass
src/test/         Preparação do ambiente e dados de teste
src/App.tsx       Composição da página e estados compartilhados
```

Os arquivos `*.test.ts` e `*.test.tsx` ficam junto ao código que verificam.

## Referências e fontes

- [Enunciado original](https://github.com/EconverseAG/teste-front-end)
- [Layout no Figma](https://www.figma.com/file/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=0%3A1)
- Licenças das fontes: [Poppins](public/fonts/OFL.txt), [Work Sans](public/fonts/WorkSans-OFL.txt) e [Outfit](public/fonts/Outfit-OFL.txt).

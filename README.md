# Pharma Find Spot

Aplicação web para localizar farmácias próximas e visualizar produtos em destaque. O projeto foi criado com Vite + React + TypeScript, utiliza Tailwind CSS para o estilo e os componentes do shadcn/ui para acelerar o desenvolvimento de interfaces modernas.

## Funcionalidades
- Catálogo de produtos com cards responsivos e filtros por texto.
- Destaques visuais para promoções e produtos populares.
- Mapa com indicação das farmácias disponíveis.
- Componentização reutilizável (Header, Footer, SearchBar, ProductGrid, etc.).
- Integração com React Router para páginas como Home e NotFound.

## Tecnologias principais
- Vite 5
- React 18 + TypeScript
- Tailwind CSS e tailwindcss-animate
- shadcn/ui (Radix UI + utilitários)
- React Router DOM
- React Hook Form, Zod e React Query para formulários e dados

## Pré-requisitos
- Node.js **>= 18** (necessário para Vite 5)
- npm **>= 9** (instalado junto com o Node)
- Opcional: Bun >= 1.0 caso prefira `bun install`

## Como executar localmente
```sh
git clone https://github.com/gdema11/pharma-find-spot.git
cd pharma-find-spot
npm install
npm run dev
```
- O servidor de desenvolvimento roda por padrão em `http://localhost:5173`.
- Ajuste variáveis, dados ou endpoints editando os arquivos em `src/`.

## Scripts disponíveis
- `npm run dev` – inicia o ambiente de desenvolvimento com Vite.
- `npm run build` – gera a versão de produção em `dist/`.
- `npm run preview` – serve o build gerado para inspeção local.
- `npm run lint` – executa o ESLint com as regras definidas em `eslint.config.js`.

## Estrutura do projeto
- `src/pages` – páginas principais (Index, NotFound).
- `src/components` – componentes reutilizáveis, incluindo UI (accordion, dialog, etc.).
- `src/data` – dados estáticos como a lista de produtos.
- `src/assets` – imagens dos produtos.
- `public` – arquivos estáticos copiados diretamente para o build final.

## Deploy
1. Gere o build com `npm run build`.
2. Publique o conteúdo da pasta `dist/` em um provedor de hospedagem estática (Vercel, Netlify, GitHub Pages, Cloudflare Pages ou servidor próprio).
3. Caso utilize pipelines, adicione um passo para instalar dependências (`npm ci`) e executar `npm run build` antes de publicar.

## Personalização
- Atualize `src/data/products.ts` para alterar as informações dos produtos exibidos.
- Ajuste estilos globais em `src/index.css` ou via classes utilitárias do Tailwind.
- Componentes do shadcn/ui ficam em `src/components/ui`; edite conforme o design desejado.
- Novas rotas podem ser adicionadas em `src/main.tsx`, onde o React Router é configurado.

## Contribuindo
1. Crie um branch (`git checkout -b feature/minha-feature`).
2. Faça suas alterações e rode `npm run lint`.
3. Abra um pull request descrevendo o que foi alterado.


# Pharma Find Spot

Aplicacao web para localizar farmacias e visualizar produtos, agora com front-end e back-end.

## Tecnologias principais
- Front-end: Vite 5, React 18, TypeScript, Tailwind CSS, shadcn/ui
- Back-end: Node.js, Express, CORS, TypeScript (via tsx)

## Pre-requisitos
- Node.js >= 18
- npm >= 9

## Como executar localmente
```sh
git clone https://github.com/gdema11/pharma-find-spot.git
cd pharma-find-spot
npm install
```

### Front-end
```sh
npm run dev
```
- Disponivel em `http://localhost:5173`.

### Back-end (API)
```sh
npm run backend
```
- Disponivel em `http://localhost:3001`.

### Back-end em modo desenvolvimento (watch)
```sh
npm run dev:backend
```

## Endpoints da API
- `GET /api/health`: status da API.
- `GET /api/aisles`: lista de corredores.
- `GET /api/categories`: lista de categorias.
- `GET /api/products`: lista de produtos.
- `GET /api/products/:id`: detalhe de produto por ID.

## Filtros em `GET /api/products`
- `q`: busca textual por nome, marca, descricao e tags.
- `category`: categoria exata.
- `aisleId`: corredor exato.

Exemplo:
```sh
http://localhost:3001/api/products?q=dipirona&category=Analg%C3%A9sicos
```

## Scripts disponiveis
- `npm run dev`: inicia o front-end com Vite.
- `npm run dev:frontend`: alias para iniciar o front-end com Vite.
- `npm run backend`: inicia o back-end.
- `npm run dev:backend`: inicia o back-end com watch.
- `npm run build`: gera a versao de producao em `dist/`.
- `npm run preview`: serve o build localmente.
- `npm run lint`: executa o ESLint.

## Estrutura
- `src/`: front-end (paginas, componentes, dados e assets).
- `backend/`: servidor da API.

## Observacao
Os dados retornados pela API sao reaproveitados de `src/data/products.ts`.

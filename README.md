# Pharma Find Spot

Aplicacao web para localizar produtos em uma farmacia, agora com front-end, back-end e persistencia em banco SQLite.

## Tecnologias principais
- Front-end: Vite 5, React 18, TypeScript, Tailwind CSS, shadcn/ui
- Back-end: Node.js, Express, CORS, TypeScript (via tsx)
- Banco de dados: SQLite com `better-sqlite3`

## Pre-requisitos
- Node.js >= 18
- npm >= 9

## Como executar localmente
```sh
git clone https://github.com/gdema11/pharma-find-spot.git
cd pharma-find-spot
npm install
```

### 1. Inicie o back-end
```sh
npm run backend
```
- API disponivel em `http://localhost:3001`
- Banco criado automaticamente em `backend/data/pharma-find-spot.db`

### 2. Inicie o front-end
```sh
npm run dev
```
- Front-end disponivel em `http://localhost:8080`
- Em desenvolvimento, o Vite encaminha `/api` para `http://localhost:3001`

### Back-end em modo desenvolvimento (watch)
```sh
npm run dev:backend
```

## Como o banco funciona
- O schema SQLite e a conexao ficam em `backend/db.ts`
- Na primeira execucao, o banco e populado automaticamente com os dados de `src/data/products.ts`
- Depois disso, a API passa a ler os dados do arquivo `.db`

## Endpoints da API
- `GET /api/health`: status da API e caminho do banco.
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
- `src/`: front-end, tipos e dados de seed.
- `backend/`: servidor da API e camada de banco.

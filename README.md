# Pharma Find Spot

Aplicação web para localizar produtos dentro de uma farmácia, com front-end em React, back-end em Express e persistência em banco SQLite.

## Tecnologias principais
- Front-end: Vite 5, React 18, TypeScript, Tailwind CSS, shadcn/ui
- Back-end: Node.js, Express, CORS, TypeScript via `tsx`
- Banco de dados: SQLite com `better-sqlite3`

## Pré-requisitos
- Node.js 18 ou superior
- npm 9 ou superior

## Como rodar o projeto
Na pasta do projeto:

```sh
npm install
```

Depois, abra dois terminais na mesma pasta.

### Terminal 1: back-end + banco de dados
```sh
npm run dev:backend
```

Isso inicia:
- API em `http://localhost:3001`
- Banco SQLite em `backend/data/pharma-find-spot.db`

### Terminal 2: front-end
```sh
npm run dev
```

Isso inicia:
- Front-end em `http://localhost:8080`

Em desenvolvimento, o Vite encaminha automaticamente as chamadas `/api` para `http://localhost:3001`.

## Como validar se está tudo funcionando
Abra no navegador:

- `http://localhost:8080`
- `http://localhost:3001/api/health`
- `http://localhost:3001/api/products`

Se esses endereços responderem, o front-end, o back-end e o banco estão funcionando.

## Como o banco funciona
- O banco do projeto é um arquivo SQLite local: `backend/data/pharma-find-spot.db`
- A conexão e o schema ficam em `backend/db.ts`
- Quando o back-end inicia, ele cria as tabelas se elas ainda não existirem
- Se o banco estiver vazio, ele popula automaticamente os dados iniciais a partir de `src/data/products.ts`
- Depois disso, a API passa a consultar o arquivo `.db`

## O que acontece quando o usuário usa o sistema
- Ao abrir a página, o front-end busca corredores, categorias e produtos pela API
- A API consulta o banco SQLite e devolve os dados em JSON
- Quando o usuário pesquisa ou filtra, o front-end envia os filtros para a API
- A API consulta o banco com esses filtros e devolve os resultados
- Quando o usuário clica em um produto, a interface destaca o corredor correspondente
- Nesse clique, o sistema não grava nada no banco; ele apenas usa os dados já carregados para mostrar a localização do produto

## Endpoints da API
- `GET /api/health`: status da API e caminho do banco
- `GET /api/aisles`: lista de corredores
- `GET /api/categories`: lista de categorias
- `GET /api/products`: lista de produtos
- `GET /api/products/:id`: detalhe de um produto por ID

## Filtros em `GET /api/products`
- `q`: busca textual por nome, marca, descrição e tags
- `category`: categoria exata
- `aisleId`: corredor exato

Exemplo:

```sh
http://localhost:3001/api/products?q=dipirona&category=Analg%C3%A9sicos
```

## Scripts disponíveis
- `npm run dev`: inicia o front-end com Vite
- `npm run dev:frontend`: alias para iniciar o front-end com Vite
- `npm run backend`: inicia o back-end sem watch
- `npm run dev:backend`: inicia o back-end com recarga automática
- `npm run build`: gera a versão de produção em `dist/`
- `npm run build:dev`: gera build em modo development
- `npm run preview`: serve o build localmente
- `npm run lint`: executa o ESLint

## Estrutura
- `src/`: front-end, tipos e dados iniciais dos produtos
- `backend/`: servidor da API, banco de dados e arquivo SQLite

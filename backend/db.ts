import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aisles, categories, products } from "../src/data/products";
import {
  getProductSearchRank,
  matchesSearchQuery,
  normalizeSearchText,
} from "../src/lib/search";
import type { Aisle, Product } from "../src/types/catalog";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "pharma-find-spot.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

type ProductRow = {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  priceInCents: number;
  stock: number;
  availability: Product["availability"];
  tag: string | null;
};

type ProductFilters = {
  q?: string;
  category?: string;
  aisleId?: string;
  availability?: string;
  sort?: "name" | "price-asc" | "price-desc" | "stock-desc";
};

function ensureColumn(tableName: string, columnName: string, definition: string) {
  const columns = db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all() as Array<{ name: string }>;

  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
}

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS aisles (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      aisle_id TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (aisle_id) REFERENCES aisles(id)
    );

    CREATE TABLE IF NOT EXISTS product_tags (
      product_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id),
      PRIMARY KEY (product_id, tag)
    );
  `);
  ensureColumn("products", "price_in_cents", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn("products", "stock", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn("products", "availability", "TEXT NOT NULL DEFAULT 'Em estoque'");

  const insertAisle = db.prepare(`
    INSERT OR REPLACE INTO aisles (id, label, summary, description)
    VALUES (@id, @label, @summary, @description)
  `);

  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (name)
    VALUES (?)
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id,
      name,
      brand,
      category,
      aisle_id,
      description,
      price_in_cents,
      stock,
      availability
    )
    VALUES (
      @id,
      @name,
      @brand,
      @category,
      @aisleId,
      @description,
      @priceInCents,
      @stock,
      @availability
    )
  `);

  const insertProductTag = db.prepare(`
    INSERT INTO product_tags (product_id, tag)
    VALUES (?, ?)
  `);

  const seedDatabase = db.transaction(() => {
    // Keep demo data deterministic so the UI and the database stay aligned.
    db.exec(`
      DELETE FROM product_tags;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM aisles;
    `);

    for (const aisle of aisles) {
      insertAisle.run(aisle);
    }

    for (const category of categories) {
      insertCategory.run(category);
    }

    for (const product of products) {
      insertProduct.run(product);

      for (const tag of product.tags ?? []) {
        insertProductTag.run(product.id, tag);
      }
    }
  });

  seedDatabase();
}

function mapProductRows(rows: ProductRow[]): Product[] {
  const productMap = new Map<string, Product>();

  for (const row of rows) {
    const current = productMap.get(row.id);

    if (current) {
      if (row.tag) {
        current.tags = [...(current.tags ?? []), row.tag];
      }
      continue;
    }

    productMap.set(row.id, {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      aisleId: row.aisleId,
      description: row.description,
      priceInCents: row.priceInCents,
      stock: row.stock,
      availability: row.availability,
      tags: row.tag ? [row.tag] : [],
    });
  }

  return Array.from(productMap.values());
}

initializeDatabase();

export function getAisles(): Aisle[] {
  return db
    .prepare(
      `
      SELECT id, label, summary, description
      FROM aisles
      ORDER BY CAST(REPLACE(id, 'corredor-', '') AS INTEGER) ASC
      `
    )
    .all() as Aisle[];
}

export function getCategories(): string[] {
  const rows = db
    .prepare("SELECT name FROM categories ORDER BY name ASC")
    .all() as Array<{ name: string }>;

  return rows.map((row) => row.name);
}

export function getProducts(filters: ProductFilters): Product[] {
  const conditions: string[] = [];
  const params: Record<string, string> = {};
  const normalizedQuery = normalizeSearchText(filters.q ?? "");

  if (filters.category) {
    conditions.push("lower(p.category) = @category");
    params.category = filters.category.toLowerCase();
  }

  if (filters.aisleId) {
    conditions.push("p.aisle_id = @aisleId");
    params.aisleId = filters.aisleId;
  }

  if (filters.availability) {
    conditions.push("lower(p.availability) = @availability");
    params.availability = filters.availability.toLowerCase();
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.category,
        p.aisle_id as aisleId,
        p.description,
        p.price_in_cents as priceInCents,
        p.stock,
        p.availability as availability,
        pt.tag
      FROM products p
      LEFT JOIN product_tags pt ON pt.product_id = p.id
      ${whereClause}
      ORDER BY p.name ASC, pt.tag ASC
      `
    )
    .all(params) as ProductRow[];

  const mappedProducts = mapProductRows(rows);
  const textFilteredProducts = normalizedQuery
    ? mappedProducts.filter((product) => matchesSearchQuery(product, normalizedQuery))
    : mappedProducts;

  return textFilteredProducts.sort((first, second) => {
    if (normalizedQuery) {
      const rankDifference =
        getProductSearchRank(first, normalizedQuery) -
        getProductSearchRank(second, normalizedQuery);

      if (rankDifference !== 0) {
        return rankDifference;
      }
    }

    if (filters.sort === "price-asc") {
      if (first.priceInCents !== second.priceInCents) {
        return first.priceInCents - second.priceInCents;
      }
    } else if (filters.sort === "price-desc") {
      if (first.priceInCents !== second.priceInCents) {
        return second.priceInCents - first.priceInCents;
      }
    } else if (filters.sort === "stock-desc") {
      if (first.stock !== second.stock) {
        return second.stock - first.stock;
      }
    }

    return first.name.localeCompare(second.name, "pt-BR");
  });
}

export function getProductById(id: string): Product | null {
  const rows = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.category,
        p.aisle_id as aisleId,
        p.description,
        p.price_in_cents as priceInCents,
        p.stock,
        p.availability as availability,
        pt.tag
      FROM products p
      LEFT JOIN product_tags pt ON pt.product_id = p.id
      WHERE p.id = ?
      ORDER BY pt.tag ASC
      `
    )
    .all(id) as ProductRow[];

  if (rows.length === 0) {
    return null;
  }

  return mapProductRows(rows)[0];
}

type CreateProductInput = {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  priceInCents: number;
  stock: number;
  availability: Product["availability"];
  tags?: string[];
};

type UpdateProductInput = Partial<Omit<CreateProductInput, "id">>;

export function createProduct(input: CreateProductInput): Product {
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, brand, category, aisle_id, description, price_in_cents, stock, availability)
    VALUES (@id, @name, @brand, @category, @aisleId, @description, @priceInCents, @stock, @availability)
  `);

  const insertTag = db.prepare(`
    INSERT OR IGNORE INTO product_tags (product_id, tag) VALUES (?, ?)
  `);

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name) VALUES (?)
  `);

  db.transaction(() => {
    insertProduct.run(input);
    insertCategory.run(input.category);
    for (const tag of input.tags ?? []) {
      insertTag.run(input.id, tag);
    }
  })();

  return getProductById(input.id)!;
}

export function updateProduct(id: string, input: UpdateProductInput): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  if (input.name !== undefined) { fields.push("name = @name"); params.name = input.name; }
  if (input.brand !== undefined) { fields.push("brand = @brand"); params.brand = input.brand; }
  if (input.category !== undefined) { fields.push("category = @category"); params.category = input.category; }
  if (input.aisleId !== undefined) { fields.push("aisle_id = @aisleId"); params.aisleId = input.aisleId; }
  if (input.description !== undefined) { fields.push("description = @description"); params.description = input.description; }
  if (input.priceInCents !== undefined) { fields.push("price_in_cents = @priceInCents"); params.priceInCents = input.priceInCents; }
  if (input.stock !== undefined) { fields.push("stock = @stock"); params.stock = input.stock; }
  if (input.availability !== undefined) { fields.push("availability = @availability"); params.availability = input.availability; }

  db.transaction(() => {
    if (fields.length > 0) {
      db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = @id`).run(params);
    }

    if (input.tags !== undefined) {
      db.prepare("DELETE FROM product_tags WHERE product_id = ?").run(id);
      const insertTag = db.prepare("INSERT OR IGNORE INTO product_tags (product_id, tag) VALUES (?, ?)");
      for (const tag of input.tags) {
        insertTag.run(id, tag);
      }
    }

    if (input.category !== undefined) {
      db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)").run(input.category);
    }
  })();

  return getProductById(id);
}

export function deleteProduct(id: string): boolean {
  const existing = getProductById(id);
  if (!existing) return false;

  db.transaction(() => {
    db.prepare("DELETE FROM product_tags WHERE product_id = ?").run(id);
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  })();

  return true;
}

export { dbPath };

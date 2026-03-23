import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aisles, categories, products } from "../src/data/products";
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

  if (filters.q) {
    conditions.push(`
      (
        lower(p.name) LIKE @query OR
        lower(p.brand) LIKE @query OR
        lower(p.description) LIKE @query OR
        EXISTS (
          SELECT 1
          FROM product_tags pt2
          WHERE pt2.product_id = p.id
            AND lower(pt2.tag) LIKE @query
        )
      )
    `);
    params.query = `%${filters.q.toLowerCase()}%`;
  }

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

  const orderClause =
    filters.sort === "price-asc"
      ? "ORDER BY p.price_in_cents ASC, p.name ASC, pt.tag ASC"
      : filters.sort === "price-desc"
        ? "ORDER BY p.price_in_cents DESC, p.name ASC, pt.tag ASC"
        : filters.sort === "stock-desc"
          ? "ORDER BY p.stock DESC, p.name ASC, pt.tag ASC"
          : "ORDER BY p.name ASC, pt.tag ASC";

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
      ${orderClause}
      `
    )
    .all(params) as ProductRow[];

  return mapProductRows(rows);
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

export { dbPath };

import cors from "cors";
import express from "express";
import {
  createProduct,
  dbPath,
  deleteProduct,
  getAisles,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
} from "./db";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pharma-find-spot-api",
    database: dbPath,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/aisles", (_req, res) => {
  res.json(getAisles());
});

app.get("/api/categories", (_req, res) => {
  res.json(getCategories());
});

app.get("/api/products", (req, res) => {
  const q =
    typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
  const category =
    typeof req.query.category === "string"
      ? req.query.category.trim().toLowerCase()
      : "";
  const aisleId =
    typeof req.query.aisleId === "string" ? req.query.aisleId.trim() : "";
  const availability =
    typeof req.query.availability === "string"
      ? req.query.availability.trim().toLowerCase()
      : "";
  const sort =
    req.query.sort === "price-asc" ||
    req.query.sort === "price-desc" ||
    req.query.sort === "stock-desc"
      ? req.query.sort
      : "name";

  const filtered = getProducts({ q, category, aisleId, availability, sort });

  res.json({
    total: filtered.length,
    items: filtered,
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    res.status(404).json({
      error: "Produto não encontrado",
    });
    return;
  }

  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { id, name, brand, category, aisleId, description, priceInCents, stock, availability, tags } = req.body;

  if (!id || !name || !brand || !category || !aisleId || !description || !availability ||
      typeof priceInCents !== "number" || !Number.isFinite(priceInCents) || priceInCents < 0 ||
      typeof stock !== "number" || !Number.isFinite(stock) || stock < 0) {
    res.status(400).json({ error: "Campos obrigatórios faltando ou inválidos: id, name, brand, category, aisleId, description, priceInCents (número >= 0), stock (número >= 0), availability" });
    return;
  }

  const existing = getProductById(id);
  if (existing) {
    res.status(409).json({ error: "Já existe um produto com esse id" });
    return;
  }

  const product = createProduct({ id, name, brand, category, aisleId, description, priceInCents, stock, availability, tags });
  res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const updated = updateProduct(req.params.id, req.body);

  if (!updated) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }

  res.json(updated);
});

app.delete("/api/products/:id", (req, res) => {
  const deleted = deleteProduct(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`API online em http://localhost:${port}`);
  console.log(`Banco SQLite em ${dbPath}`);
});

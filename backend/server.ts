import cors from "cors";
import express from "express";
import { aisles, categories, products } from "../src/data/products";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pharma-find-spot-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/aisles", (_req, res) => {
  res.json(aisles);
});

app.get("/api/categories", (_req, res) => {
  res.json(categories);
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

  const filtered = products.filter((product) => {
    const matchesQuery =
      q.length === 0 ||
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(q));

    const matchesCategory =
      category.length === 0 || product.category.toLowerCase() === category;

    const matchesAisle = aisleId.length === 0 || product.aisleId === aisleId;

    return matchesQuery && matchesCategory && matchesAisle;
  });

  res.json({
    total: filtered.length,
    items: filtered,
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    res.status(404).json({
      error: "Produto nao encontrado",
    });
    return;
  }

  res.json(product);
});

app.listen(port, () => {
  console.log(`API online em http://localhost:${port}`);
});

import cors from "cors";
import express from "express";
import {
  dbPath,
  getAisles,
  getCategories,
  getProductById,
  getProducts,
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

  const filtered = getProducts({ q, category, aisleId });

  res.json({
    total: filtered.length,
    items: filtered,
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = getProductById(req.params.id);

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
  console.log(`Banco SQLite em ${dbPath}`);
});

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductAvailability } from "@/types/catalog";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ProductFormData = {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  priceInCents: number;
  stock: number;
  availability: ProductAvailability;
  tags: string;
};

const emptyForm: ProductFormData = {
  id: "",
  name: "",
  brand: "",
  category: "",
  aisleId: "",
  description: "",
  priceInCents: 0,
  stock: 0,
  availability: "Em estoque",
  tags: "",
};

function productToForm(p: Product): ProductFormData {
  return {
    ...p,
    priceInCents: p.priceInCents,
    stock: p.stock,
    tags: (p.tags ?? []).join(", "),
  };
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Erro ao carregar produtos");
  const data = await res.json();
  return data.items;
}

async function fetchAisles() {
  const res = await fetch(`${API_BASE}/api/aisles`);
  if (!res.ok) throw new Error("Erro ao carregar corredores");
  return res.json();
}

async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error("Erro ao carregar categorias");
  return res.json();
}

async function apiCreateProduct(form: ProductFormData): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Erro ao criar produto");
  }
  return res.json();
}

async function apiUpdateProduct(id: string, form: Partial<ProductFormData>): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      tags:
        typeof form.tags === "string"
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : form.tags,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Erro ao atualizar produto");
  }
  return res.json();
}

async function apiDeleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Erro ao remover produto");
  }
}

export default function AdminProdutos() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", "all"], queryFn: fetchProducts });
  const { data: aisles = [] } = useQuery({ queryKey: ["aisles"], queryFn: fetchAisles });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const createMutation = useMutation({
    mutationFn: apiCreateProduct,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); setDialogOpen(false); },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: ProductFormData }) => apiUpdateProduct(id, form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); setDialogOpen(false); },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteProduct,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); setConfirmDelete(null); },
    onError: (e: Error) => setError(e.message),
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm(productToForm(product));
    setError(null);
    setDialogOpen(true);
  }

  function handleSubmit() {
    setError(null);

    if (!editingId && !form.id.trim()) { setError("O campo ID é obrigatório."); return; }
    if (!form.name.trim()) { setError("O campo Nome é obrigatório."); return; }
    if (!form.brand.trim()) { setError("O campo Marca é obrigatório."); return; }
    if (!form.category) { setError("Selecione uma Categoria."); return; }
    if (!form.aisleId) { setError("Selecione um Corredor."); return; }
    if (!form.description.trim()) { setError("O campo Descrição é obrigatório."); return; }
    if (!Number.isFinite(form.priceInCents) || form.priceInCents < 0) { setError("Preço deve ser um número positivo."); return; }
    if (!Number.isFinite(form.stock) || form.stock < 0) { setError("Estoque deve ser um número positivo."); return; }

    if (editingId) {
      updateMutation.mutate({ id: editingId, form });
    } else {
      createMutation.mutate(form);
    }
  }

  function field(key: keyof ProductFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
          <Button onClick={openCreate}>+ Novo Produto</Button>
        </div>

        {isLoading && <p className="text-muted-foreground">Carregando produtos...</p>}

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Nome</th>
                <th className="text-left px-4 py-3">Marca</th>
                <th className="text-left px-4 py-3">Categoria</th>
                <th className="text-left px-4 py-3">Corredor</th>
                <th className="text-right px-4 py-3">Preço</th>
                <th className="text-right px-4 py-3">Estoque</th>
                <th className="text-left px-4 py-3">Disponibilidade</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.aisleId}</td>
                  <td className="px-4 py-3 text-right">
                    {(p.priceInCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">{p.availability}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(p.id)}>Remover</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {!editingId && (
              <div className="grid gap-1">
                <Label>ID (único, sem espaços)</Label>
                <Input value={form.id} onChange={(e) => field("id", e.target.value)} placeholder="ex: dipirona-500mg" />
              </div>
            )}

            <div className="grid gap-1">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => field("name", e.target.value)} />
            </div>

            <div className="grid gap-1">
              <Label>Marca</Label>
              <Input value={form.brand} onChange={(e) => field("brand", e.target.value)} />
            </div>

            <div className="grid gap-1">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => field("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Corredor</Label>
              <Select value={form.aisleId} onValueChange={(v) => field("aisleId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {aisles.map((a: { id: string; label: string }) => (
                    <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Descrição</Label>
              <Input value={form.description} onChange={(e) => field("description", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Preço (centavos)</Label>
                <Input type="number" min={0} value={form.priceInCents} onChange={(e) => field("priceInCents", Number(e.target.value))} />
              </div>
              <div className="grid gap-1">
                <Label>Estoque</Label>
                <Input type="number" min={0} value={form.stock} onChange={(e) => field("stock", Number(e.target.value))} />
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Disponibilidade</Label>
              <Select value={form.availability} onValueChange={(v) => field("availability", v as ProductAvailability)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em estoque">Em estoque</SelectItem>
                  <SelectItem value="Ultimas unidades">Últimas unidades</SelectItem>
                  <SelectItem value="Sob encomenda">Sob encomenda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Tags (separadas por vírgula)</Label>
              <Input value={form.tags} onChange={(e) => field("tags", e.target.value)} placeholder="ex: dor, febre, analgesico" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)}
            >
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

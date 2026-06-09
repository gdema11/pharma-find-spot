import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type FeedbackState =
  | { type: "success"; title: string; description: string }
  | { type: "error"; title: string; description: string }
  | null;

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
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchProducts,
  });

  const { data: aisles = [] } = useQuery({
    queryKey: ["aisles"],
    queryFn: fetchAisles,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const productToDelete = useMemo(
    () => products.find((product) => product.id === confirmDelete) ?? null,
    [products, confirmDelete],
  );

  const createMutation = useMutation({
    mutationFn: apiCreateProduct,
    onSuccess: (createdProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
      setFeedback({
        type: "success",
        title: "Produto adicionado com sucesso",
        description: `${createdProduct.name} foi cadastrado no catálogo.`,
      });
    },
    onError: (e: Error) => {
      setError(e.message);
      setFeedback({
        type: "error",
        title: "Não foi possível adicionar o produto",
        description: e.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: ProductFormData }) => apiUpdateProduct(id, form),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      setEditingId(null);
      setError(null);
      setFeedback({
        type: "success",
        title: "Produto atualizado com sucesso",
        description: `${updatedProduct.name} foi atualizado no catálogo.`,
      });
    },
    onError: (e: Error) => {
      setError(e.message);
      setFeedback({
        type: "error",
        title: "Não foi possível atualizar o produto",
        description: e.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteProduct,
    onSuccess: () => {
      const removedName = productToDelete?.name ?? "Produto";
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setConfirmDelete(null);
      setError(null);
      setFeedback({
        type: "success",
        title: "Produto removido com sucesso",
        description: `${removedName} foi removido do catálogo.`,
      });
    },
    onError: (e: Error) => {
      setConfirmDelete(null);
      setError(e.message);
      setFeedback({
        type: "error",
        title: "Não foi possível remover o produto",
        description: e.message,
      });
    },
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

  function closeDialog(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setError(null);
      if (!editingId) {
        setForm(emptyForm);
      }
    }
  }

  function handleSubmit() {
    setError(null);
    setFeedback(null);

    if (!editingId && !form.id.trim()) {
      setError("O campo ID é obrigatório.");
      return;
    }

    if (!form.name.trim()) {
      setError("O campo Nome é obrigatório.");
      return;
    }

    if (!form.brand.trim()) {
      setError("O campo Marca é obrigatório.");
      return;
    }

    if (!form.category) {
      setError("Selecione uma Categoria.");
      return;
    }

    if (!form.aisleId) {
      setError("Selecione um Corredor.");
      return;
    }

    if (!form.description.trim()) {
      setError("O campo Descrição é obrigatório.");
      return;
    }

    if (!Number.isFinite(form.priceInCents) || form.priceInCents < 0) {
      setError("Preço deve ser um número positivo.");
      return;
    }

    if (!Number.isFinite(form.stock) || form.stock < 0) {
      setError("Estoque deve ser um número positivo.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, form });
      return;
    }

    createMutation.mutate(form);
  }

  function field(key: keyof ProductFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
          <Button onClick={openCreate}>+ Novo Produto</Button>
        </div>

        {feedback && (
          <Alert
            variant={feedback.type === "error" ? "destructive" : "default"}
            className="mb-6 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              {feedback.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <div>
                <AlertTitle>{feedback.title}</AlertTitle>
                <AlertDescription>{feedback.description}</AlertDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setFeedback(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {isLoading && <p className="text-muted-foreground">Carregando produtos...</p>}

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Marca</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Corredor</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-right">Estoque</th>
                <th className="px-4 py-3 text-left">Disponibilidade</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.aisleId}</td>
                  <td className="px-4 py-3 text-right">
                    {(p.priceInCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">{p.availability}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(p.id)}>
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {!editingId && (
              <div className="grid gap-1">
                <Label>ID (único, sem espaços)</Label>
                <Input
                  value={form.id}
                  onChange={(e) => field("id", e.target.value)}
                  placeholder="ex: dipirona-500mg"
                />
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
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
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
                    <SelectItem key={a.id} value={a.id}>
                      {a.label}
                    </SelectItem>
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
                <Input
                  type="number"
                  min={0}
                  value={form.priceInCents}
                  onChange={(e) => field("priceInCents", Number(e.target.value))}
                />
              </div>
              <div className="grid gap-1">
                <Label>Estoque</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => field("stock", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Disponibilidade</Label>
              <Select
                value={form.availability}
                onValueChange={(v) => field("availability", v as ProductAvailability)}
              >
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
              <Input
                value={form.tags}
                onChange={(e) => field("tags", e.target.value)}
                placeholder="ex: dor, febre, analgesico"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não foi possível salvar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Salvando..." : editingId ? "Salvar alterações" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {productToDelete
                ? `Tem certeza que deseja remover o produto "${productToDelete.name}"?`
                : "Tem certeza que deseja remover este produto?"}
            </p>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>Essa ação não poderá ser desfeita.</AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
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
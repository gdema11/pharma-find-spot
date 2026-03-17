import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import PharmacyMap from "@/components/PharmacyMap";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import type { Aisle, Product } from "@/types/catalog";

const API_BASE_URL = "/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url}`);
  }

  return response.json() as Promise<T>;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [highlightedAisleId, setHighlightedAisleId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: aisles = [], isLoading: isLoadingAisles } = useQuery({
    queryKey: ["aisles"],
    queryFn: () => fetchJson<Aisle[]>(`${API_BASE_URL}/aisles`),
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchJson<string[]>(`${API_BASE_URL}/categories`),
  });

  const normalizedCategory =
    selectedCategory === "Todos" ? "" : selectedCategory;

  const { data: filteredProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", searchTerm, normalizedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      }

      if (normalizedCategory) {
        params.set("category", normalizedCategory);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE_URL}/products?${queryString}`
        : `${API_BASE_URL}/products`;

      const data = await fetchJson<{ total: number; items: Product[] }>(url);
      return data.items;
    },
  });

  const aislesById = useMemo(
    () =>
      aisles.reduce<Record<string, Aisle>>((acc, aisle) => {
        acc[aisle.id] = aisle;
        return acc;
      }, {}),
    [aisles]
  );

  const handleProductSelect = (product: Product) => {
    setHighlightedAisleId(product.aisleId);

    const aisleLabel = aislesById[product.aisleId]?.label ?? "Corredor";

    toast({
      title: "Produto localizado!",
      description: `${product.name} estÃ¡ no ${aisleLabel}.`,
      duration: 4000,
    });

    setTimeout(() => {
      document.getElementById("pharmacy-map")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const selectedAisle = highlightedAisleId
    ? aislesById[highlightedAisleId]
    : null;

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setHighlightedAisleId(null);
  };

  const visibleCategories = useMemo(
    () => ["Todos", ...categories.filter((category) => category !== "Todos")],
    [categories]
  );

  const featuredCategories = visibleCategories.slice(0, 6);

  const resultTitle =
    searchTerm || selectedCategory !== "Todos"
      ? `Resultados (${filteredProducts.length})`
      : "CatÃ¡logo completo";

  const isLoading =
    isLoadingAisles || isLoadingCategories || isLoadingProducts;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={visibleCategories}
        />

        <div className="flex flex-wrap gap-2">
          {featuredCategories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div id="pharmacy-map" className="scroll-mt-8">
          <PharmacyMap highlightedAisleId={highlightedAisleId} aisles={aisles} />
        </div>

        {selectedAisle && (
          <div className="bg-muted/40 border border-border rounded-2xl px-6 py-5 shadow-sm transition-smooth">
            <p className="text-sm font-semibold uppercase text-muted-foreground tracking-widest mb-1">
              {selectedAisle.label}
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {selectedAisle.summary}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {selectedAisle.description}
            </p>
          </div>
        )}

        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <h2 className="text-3xl font-bold text-foreground">{resultTitle}</h2>
            <p className="text-sm text-muted-foreground">
              Explore a curadoria da farmÃ¡cia e toque no item para ver o corredor correspondente.
            </p>
          </div>

          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Carregando dados do banco...
            </p>
          )}

          <ProductGrid
            products={filteredProducts}
            aislesById={aislesById}
            onProductSelect={handleProductSelect}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

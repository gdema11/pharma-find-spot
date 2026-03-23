import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
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

  const { data: aisles = [], isLoading: isLoadingAisles } = useQuery({
    queryKey: ["aisles"],
    queryFn: () => fetchJson<Aisle[]>(`${API_BASE_URL}/aisles`),
  });

  const { data: filteredProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
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
      aisles.reduce<Record<string, Aisle>>((accumulator, aisle) => {
        accumulator[aisle.id] = aisle;
        return accumulator;
      }, {}),
    [aisles]
  );

  const isLoading = isLoadingAisles || isLoadingProducts;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            Carregando...
          </p>
        ) : (
          <ProductGrid products={filteredProducts} aislesById={aislesById} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

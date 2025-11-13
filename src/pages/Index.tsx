import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import PharmacyMap from "@/components/PharmacyMap";
import Footer from "@/components/Footer";
import { products, Product, aislesById } from "@/data/products";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [highlightedAisleId, setHighlightedAisleId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch) ||
        product.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch)
        );

      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleProductSelect = (product: Product) => {
    setHighlightedAisleId(product.aisleId);

    const aisleLabel = aislesById[product.aisleId]?.label ?? "Corredor";

    toast({
      title: "Produto localizado!",
      description: `${product.name} está no ${aisleLabel}.`,
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

  const resultTitle =
    searchTerm || selectedCategory !== "Todos"
      ? `Resultados (${filteredProducts.length})`
      : "Catálogo completo";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="flex flex-wrap gap-2">
          {["Todos", "Analgésicos", "Vitaminas e Suplementos", "Higiene Pessoal", "Primeiros Socorros", "Equipamentos Médicos"].map((category) => {
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
          <PharmacyMap highlightedAisleId={highlightedAisleId} />
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
              Explore a curadoria da farmácia e toque no item para ver o corredor correspondente.
            </p>
          </div>

          <ProductGrid
            products={filteredProducts}
            onProductSelect={handleProductSelect}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

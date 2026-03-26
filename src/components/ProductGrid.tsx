import ProductCard from "@/components/ProductCard";
import type { Aisle, Product } from "@/types/catalog";
import { SearchX } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  aislesById: Record<string, Aisle>;
  searchTerm?: string;
  emptySuggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  didYouMean?: string | null;
}

const ProductGrid = ({
  products,
  aislesById,
  searchTerm = "",
  emptySuggestions = [],
  onSuggestionSelect,
  didYouMean,
}: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <SearchX className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="text-2xl font-semibold text-foreground">
          Nenhum produto encontrado
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          Tente outro termo ou escolha uma sugestao relacionada abaixo.
        </p>
        {didYouMean ? (
          <button
            type="button"
            onClick={() => onSuggestionSelect?.(didYouMean)}
            className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Voce quis dizer "{didYouMean}"?
          </button>
        ) : null}
        {emptySuggestions.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {emptySuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionSelect?.(suggestion)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          aislesById={aislesById}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

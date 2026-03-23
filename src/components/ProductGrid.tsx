import ProductCard from "@/components/ProductCard";
import type { Aisle, Product } from "@/types/catalog";
import { SearchX } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  aislesById: Record<string, Aisle>;
}

const ProductGrid = ({ products, aislesById }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <SearchX className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="text-2xl font-semibold text-foreground">
          Nenhum produto encontrado
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          Tente outro termo ou ajuste os filtros para ver mais resultados.
        </p>
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
        />
      ))}
    </div>
  );
};

export default ProductGrid;

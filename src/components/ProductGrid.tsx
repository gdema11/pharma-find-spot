import ProductCard from "@/components/ProductCard";
import type { Aisle, Product } from "@/types/catalog";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  aislesById: Record<string, Aisle>;
  onProductSelect: (product: Product) => void;
}

const ProductGrid = ({ products, aislesById, onProductSelect }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-20 h-20 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Ajuste o termo digitado ou explore outra categoria para visualizar os
          itens disponíveis na farmácia.
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
          onSelect={onProductSelect}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

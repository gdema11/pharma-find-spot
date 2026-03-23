import { Card } from "@/components/ui/card";
import type { Aisle, Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
  aislesById: Record<string, Aisle>;
}

function formatCurrency(priceInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}

const ProductCard = ({ product, aislesById }: ProductCardProps) => {
  const aisle = aislesById[product.aisleId];

  return (
    <Card className="border-border/70 bg-card px-5 py-4 shadow-sm transition-smooth hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.brand}</p>
          <p className="mt-3 text-sm font-medium text-primary/85">
            {aisle?.label ?? "Corredor"}
          </p>
        </div>
        <p className="rounded-full bg-primary/8 px-3 py-1 text-base font-semibold text-primary">
          {formatCurrency(product.priceInCents)}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;

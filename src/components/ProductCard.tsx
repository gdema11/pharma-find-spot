import { Card } from "@/components/ui/card";
import type { Aisle, Product } from "@/types/catalog";
import {
  Activity,
  Baby,
  Droplets,
  HeartPulse,
  Leaf,
  LucideIcon,
  MapPin,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  LifeBuoy,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  aislesById: Record<string, Aisle>;
  onSelect: (product: Product) => void;
}

const categoryVisuals: Record<
  string,
  { icon: LucideIcon; badgeClass: string; accentClass: string }
> = {
  "Analgésicos": {
    icon: HeartPulse,
    badgeClass: "bg-rose-500/10 text-rose-600",
    accentClass: "text-rose-600",
  },
  "Medicamentos OTC": {
    icon: ShieldCheck,
    badgeClass: "bg-sky-500/10 text-sky-600",
    accentClass: "text-sky-600",
  },
  "Vitaminas e Suplementos": {
    icon: Sparkles,
    badgeClass: "bg-amber-500/10 text-amber-600",
    accentClass: "text-amber-600",
  },
  "Higiene Pessoal": {
    icon: Droplets,
    badgeClass: "bg-cyan-500/10 text-cyan-600",
    accentClass: "text-cyan-600",
  },
  "Cuidados com a Pele": {
    icon: Sparkles,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
    accentClass: "text-emerald-600",
  },
  "Dermocosméticos": {
    icon: Sparkles,
    badgeClass: "bg-purple-500/10 text-purple-600",
    accentClass: "text-purple-600",
  },
  "Higiene Bucal": {
    icon: ShieldCheck,
    badgeClass: "bg-indigo-500/10 text-indigo-600",
    accentClass: "text-indigo-600",
  },
  "Bebês e Infantil": {
    icon: Baby,
    badgeClass: "bg-pink-500/10 text-pink-600",
    accentClass: "text-pink-600",
  },
  "Primeiros Socorros": {
    icon: LifeBuoy,
    badgeClass: "bg-red-500/10 text-red-600",
    accentClass: "text-red-600",
  },
  "Equipamentos Médicos": {
    icon: PackageSearch,
    badgeClass: "bg-slate-500/10 text-slate-600",
    accentClass: "text-slate-600",
  },
  Diabetes: {
    icon: Activity,
    badgeClass: "bg-orange-500/10 text-orange-600",
    accentClass: "text-orange-600",
  },
  "Chás e Naturais": {
    icon: Leaf,
    badgeClass: "bg-lime-500/10 text-lime-600",
    accentClass: "text-lime-600",
  },
  "Suplementos Esportivos": {
    icon: Activity,
    badgeClass: "bg-blue-500/10 text-blue-600",
    accentClass: "text-blue-600",
  },
  "Bem-estar": {
    icon: Sparkles,
    badgeClass: "bg-fuchsia-500/10 text-fuchsia-600",
    accentClass: "text-fuchsia-600",
  },
};

const ProductCard = ({ product, aislesById, onSelect }: ProductCardProps) => {
  const visual = categoryVisuals[product.category] ?? {
    icon: PackageSearch,
    badgeClass: "bg-muted text-muted-foreground",
    accentClass: "text-foreground",
  };

  const Icon = visual.icon;
  const aisle = aislesById[product.aisleId];

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(product);
        }
      }}
      className="h-full overflow-hidden cursor-pointer transition-all duration-300 bg-card hover:-translate-y-1 hover:shadow-lg hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4 border-b border-border/60 px-6 py-5 bg-muted/40">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-semibold ${visual.badgeClass}`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </span>
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold uppercase tracking-wider bg-background border border-border px-3 py-1 rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" />
            {aisle?.label ?? "Corredor"}
          </span>
          <span className="text-xs text-muted-foreground">
            {aisle?.summary ?? product.category}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

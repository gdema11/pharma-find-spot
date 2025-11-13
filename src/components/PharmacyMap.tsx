import { aisles } from "@/data/products";
import { cn } from "@/lib/utils";
import { Compass, MapPin } from "lucide-react";

interface PharmacyMapProps {
  highlightedAisleId: string | null;
}

const PharmacyMap = ({ highlightedAisleId }: PharmacyMapProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/60 px-6 py-7">
      <div className="flex flex-col items-center gap-2 text-center mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Compass className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Mapa inteligente da farmácia</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Toque em um produto para destacar o corredor correspondente e receber instruções rápidas.
        </p>
      </div>

      {highlightedAisleId && (
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-2">
            <MapPin className="w-4 h-4" />
            {aisles.find((aisle) => aisle.id === highlightedAisleId)?.label ??
              "Corredor"}
          </div>
          <p className="text-sm text-muted-foreground max-w-lg">
            Dirija-se ao corredor em destaque e procure pelas sinalizações da categoria indicada.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {aisles.map((aisle, index) => {
          const isActive = aisle.id === highlightedAisleId;

          return (
            <div
              key={aisle.id}
              className={cn(
                "relative rounded-xl border px-5 py-4 text-left transition-all duration-300",
                "bg-muted/40 border-border hover:border-primary/50 hover:shadow-md",
                isActive &&
                  "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-[1.02]"
              )}
            >
              <div
                className={cn(
                  "text-sm font-semibold text-muted-foreground/70",
                  isActive && "text-primary-foreground/80"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="mt-2 text-lg font-semibold">{aisle.label}</div>
              <div
                className={cn(
                  "text-sm font-medium mt-2",
                  isActive ? "text-primary-foreground/90" : "text-primary"
                )}
              >
                {aisle.summary}
              </div>
              <p
                className={cn(
                  "text-xs mt-3 leading-relaxed",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {aisle.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PharmacyMap;

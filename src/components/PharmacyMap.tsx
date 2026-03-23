import { cn } from "@/lib/utils";
import type { Aisle } from "@/types/catalog";
import { Compass, MapPin } from "lucide-react";

interface PharmacyMapProps {
  highlightedAisleId: string | null;
  aisles: Aisle[];
}

const PharmacyMap = ({ highlightedAisleId, aisles }: PharmacyMapProps) => {
  const activeAisle =
    aisles.find((aisle) => aisle.id === highlightedAisleId) ?? null;

  return (
    <section className="rounded-3xl border border-border/60 bg-card px-6 py-7 shadow-card">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Compass className="h-5 w-5" />
            <h2 className="text-2xl font-bold text-foreground">
              Mapa inteligente da farmacia
            </h2>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            O corredor em destaque muda assim que voce seleciona um produto. Isso reduz a navegacao e deixa a busca mais direta.
          </p>
        </div>

        {activeAisle && (
          <div className="rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">
              Corredor selecionado
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-4 w-4" />
              {activeAisle.label}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {aisles.map((aisle, index) => {
          const isActive = aisle.id === highlightedAisleId;

          return (
            <div
              key={aisle.id}
              className={cn(
                "rounded-2xl border px-5 py-4 transition-all duration-300",
                "bg-muted/30 border-border hover:border-primary/40 hover:shadow-md",
                isActive &&
                  "scale-[1.02] border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
                  isActive && "text-primary-foreground/80"
                )}
              >
                Area {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{aisle.label}</h3>
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  isActive ? "text-primary-foreground/90" : "text-primary"
                )}
              >
                {aisle.summary}
              </p>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
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
    </section>
  );
};

export default PharmacyMap;

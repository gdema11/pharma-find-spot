import { Pill } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/30">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em]">
            <Pill className="h-4 w-4" />
            PharmaSpot
          </div>
          <h1 className="text-3xl font-bold md:text-5xl">
            Localize qualquer produto em segundos
          </h1>
          <p className="max-w-2xl text-base text-primary-foreground/80 md:text-lg">
            Digitalizamos o mapa da farmácia para que você encontre vitaminas,
            itens de higiene, dermocosméticos e muito mais com precisão e
            autonomia total.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produto"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-16 rounded-full border border-border/70 bg-card pl-14 pr-14 text-base shadow-sm focus:border-primary"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default SearchBar;

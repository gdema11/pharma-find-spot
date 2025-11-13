import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/products";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchBarProps) => {
  const handleClearSearch = () => {
    onSearchChange("");
    onCategoryChange("Todos");
  };

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "Todos";

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 mb-8 border border-border/60">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Pesquisa inteligente
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Filtre por nome, marca ou categoria
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Busque por nome, marca ou benefício (ex.: vitamina, hidratação, febre)"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg rounded-xl border-2 focus:border-primary transition-smooth"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                aria-label="Limpar busca"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="md:w-64 h-14 text-lg rounded-xl border-2">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearSearch}
            className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium self-start"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getHighlightParts } from "@/lib/search";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  value: string;
  label: string;
  caption?: string;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSuggestionSelect?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  autoFocus?: boolean;
}

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSuggestionSelect,
  suggestions = [],
  autoFocus = false,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm, suggestions]);

  const showSuggestions = isFocused && suggestions.length > 0;

  const handleSelectSuggestion = (value: string) => {
    onSearchChange(value);
    onSuggestionSelect?.(value);
    setHighlightedIndex(-1);
    setIsFocused(false);
  };

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produto"
          value={searchTerm}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => {
            setIsFocused(true);
            onSearchChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (!showSuggestions) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlightedIndex((currentIndex) =>
                currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlightedIndex((currentIndex) =>
                currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1
              );
            }

            if (event.key === "Enter" && highlightedIndex >= 0) {
              event.preventDefault();
              handleSelectSuggestion(suggestions[highlightedIndex].value);
            }

            if (event.key === "Escape") {
              setHighlightedIndex(-1);
              setIsFocused(false);
            }
          }}
          className="h-16 rounded-full border border-border/70 bg-card pl-14 pr-14 text-base shadow-sm transition focus-visible:ring-1 focus-visible:ring-primary"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setIsFocused(true);
              onSearchChange("");
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {showSuggestions ? (
          <div
            id="search-suggestions"
            className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl"
            role="listbox"
          >
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.value}-${suggestion.caption ?? ""}`}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-start gap-3 px-5 py-3 text-left text-sm text-foreground transition",
                      index === highlightedIndex
                        ? "bg-muted"
                        : "hover:bg-muted/70"
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectSuggestion(suggestion.value)}
                    role="option"
                    aria-selected={index === highlightedIndex}
                  >
                    <Search className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="min-w-0">
                      <span className="block truncate">
                        {getHighlightParts(suggestion.label, searchTerm).map(
                          (part, partIndex) => (
                            <span
                              key={`${suggestion.value}-${partIndex}`}
                              className={part.highlighted ? "font-semibold text-primary" : ""}
                            >
                              {part.text}
                            </span>
                          )
                        )}
                      </span>
                      {suggestion.caption ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {suggestion.caption}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SearchBar;

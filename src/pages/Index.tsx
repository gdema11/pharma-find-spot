import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import SearchBar, { type SearchSuggestion } from "@/components/SearchBar";
import {
  getDidYouMeanSuggestion,
  getProductSearchRank,
  getSearchAliases,
  normalizeSearchText,
} from "@/lib/search";
import type { Aisle, Product } from "@/types/catalog";

const API_BASE_URL = "/api";
const MAX_SUGGESTIONS = 6;
const RECENT_SEARCHES_KEY = "pharma-spot-recent-searches";
const MAX_RECENT_SEARCHES = 5;
const SEARCH_ANALYTICS_KEY = "pharma-spot-search-analytics";
const IDLE_RESET_MS = 60_000;

type SearchAnalytics = {
  topSearches: Array<{ term: string; count: number }>;
  noResultSearches: Array<{ term: string; count: number }>;
  clickedSuggestions: Array<{ term: string; count: number }>;
};

const emptyAnalytics: SearchAnalytics = {
  topSearches: [],
  noResultSearches: [],
  clickedSuggestions: [],
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url}`);
  }

  return response.json() as Promise<T>;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<SearchAnalytics>(emptyAnalytics);
  const [idleSecondsRemaining, setIdleSecondsRemaining] = useState(
    Math.floor(IDLE_RESET_MS / 1000)
  );
  const normalizedSearchTerm = searchTerm.trim();
  const normalizedQuery = normalizeSearchText(searchTerm);
  const hasSearch = normalizedSearchTerm.length > 0;
  const canShowCatalog = normalizedQuery.length >= 2;

  const { data: aisles = [], isLoading: isLoadingAisles } = useQuery({
    queryKey: ["aisles"],
    queryFn: () => fetchJson<Aisle[]>(`${API_BASE_URL}/aisles`),
  });

  const { data: filteredProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", searchTerm],
    enabled: canShowCatalog,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("q", normalizedSearchTerm);
      const queryString = params.toString();
      const url = `${API_BASE_URL}/products?${queryString}`;

      const data = await fetchJson<{ total: number; items: Product[] }>(url);
      return data.items;
    },
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const data = await fetchJson<{ total: number; items: Product[] }>(
        `${API_BASE_URL}/products`
      );
      return data.items;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchJson<string[]>(`${API_BASE_URL}/categories`),
  });

  const aislesById = useMemo(
    () =>
      aisles.reduce<Record<string, Aisle>>((accumulator, aisle) => {
        accumulator[aisle.id] = aisle;
        return accumulator;
      }, {}),
    [aisles]
  );

  useEffect(() => {
    const savedSearches = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const savedAnalytics = window.localStorage.getItem(SEARCH_ANALYTICS_KEY);

    if (!savedSearches) {
      if (!savedAnalytics) {
        return;
      }
    }

    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches) as string[]);
      } catch {
        window.localStorage.removeItem(RECENT_SEARCHES_KEY);
      }
    }

    try {
      if (savedAnalytics) {
        setAnalytics(JSON.parse(savedAnalytics) as SearchAnalytics);
      }
    } catch {
      window.localStorage.removeItem(SEARCH_ANALYTICS_KEY);
    }
  }, []);

  useEffect(() => {
    if (!hasSearch) {
      setIdleSecondsRemaining(Math.floor(IDLE_RESET_MS / 1000));
      return;
    }

    let timeoutId: number;
    let intervalId: number;

    const resetSessionTimer = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      setIdleSecondsRemaining(Math.floor(IDLE_RESET_MS / 1000));

      intervalId = window.setInterval(() => {
        setIdleSecondsRemaining((currentValue) =>
          currentValue > 0 ? currentValue - 1 : 0
        );
      }, 1000);

      timeoutId = window.setTimeout(() => {
        setSearchTerm("");
      }, IDLE_RESET_MS);
    };

    const handleActivity = () => {
      resetSessionTimer();
    };

    resetSessionTimer();

    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [hasSearch]);

  const updateAnalytics = (
    key: keyof SearchAnalytics,
    term: string,
    minimumLength = 2
  ) => {
    const normalizedTerm = normalizeSearchText(term);

    if (normalizedTerm.length < minimumLength) {
      return;
    }

    setAnalytics((currentAnalytics) => {
      const currentItems = currentAnalytics[key];
      const nextItems = [
        { term: normalizedTerm, count: 1 },
        ...currentItems,
      ].reduce<Array<{ term: string; count: number }>>((accumulator, item) => {
        const existingItem = accumulator.find((entry) => entry.term === item.term);

        if (existingItem) {
          existingItem.count += item.count;
          return accumulator;
        }

        accumulator.push({ ...item });
        return accumulator;
      }, []);

      nextItems.sort((first, second) => second.count - first.count);

      const nextAnalytics = {
        ...currentAnalytics,
        [key]: nextItems.slice(0, 5),
      };

      window.localStorage.setItem(
        SEARCH_ANALYTICS_KEY,
        JSON.stringify(nextAnalytics)
      );

      return nextAnalytics;
    });
  };

  useEffect(() => {
    if (normalizedQuery.length < 2 || isLoadingProducts || filteredProducts.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentSearches((currentSearches) => {
        const nextSearches = [
          normalizedSearchTerm,
          ...currentSearches.filter(
            (item) => normalizeSearchText(item) !== normalizeSearchText(normalizedSearchTerm)
          ),
        ].slice(0, MAX_RECENT_SEARCHES);

        window.localStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(nextSearches)
        );

        return nextSearches;
      });
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [
    filteredProducts.length,
    isLoadingProducts,
    normalizedQuery,
    normalizedSearchTerm,
  ]);

  useEffect(() => {
    if (!canShowCatalog || isLoadingProducts) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateAnalytics("topSearches", normalizedSearchTerm);

      if (filteredProducts.length === 0) {
        updateAnalytics("noResultSearches", normalizedSearchTerm);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [
    canShowCatalog,
    filteredProducts.length,
    isLoadingProducts,
    normalizedSearchTerm,
  ]);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!normalizedQuery) {
      return recentSearches.map((value) => ({
        value,
        label: value,
        caption: "Busca recente",
      }));
    }

    const seen = new Set<string>();
    const rankedSuggestions: Array<SearchSuggestion & { score: number }> = [];
    const aliases = getSearchAliases(normalizedQuery);

    const addSuggestion = (value: string, score: number, caption?: string) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        return;
      }

      const key = normalizeSearchText(trimmedValue);

      if (!key || seen.has(key)) {
        return;
      }

      if (
        aliases.every(
          (alias) =>
            !key.includes(alias) &&
            getProductSearchRank(
              {
                id: key,
                name: trimmedValue,
                brand: caption ?? "",
                category: "",
                aisleId: "",
                description: "",
                priceInCents: 0,
                stock: 0,
                availability: "Em estoque",
                tags: [],
              },
              normalizedQuery
            ) > 10
        )
      ) {
        return;
      }

      seen.add(key);
      rankedSuggestions.push({ value: trimmedValue, label: trimmedValue, caption, score });
    };

    for (const product of allProducts) {
      const productRank = getProductSearchRank(product, normalizedQuery);

      if (productRank > 12) {
        continue;
      }

      addSuggestion(product.name, productRank, "Produto");
      addSuggestion(product.brand, productRank + 2, "Marca");
      addSuggestion(product.category, productRank + 3, "Categoria");

      for (const tag of product.tags ?? []) {
        addSuggestion(tag, productRank + 4, "Termo relacionado");
      }
    }

    for (const category of categories) {
      addSuggestion(category, 5, "Categoria");
    }

    for (const recentSearch of recentSearches) {
      addSuggestion(recentSearch, 6, "Busca recente");
    }

    return rankedSuggestions
      .sort((first, second) => {
        if (first.score !== second.score) {
          return first.score - second.score;
        }

        return first.label.localeCompare(second.label, "pt-BR");
      })
      .slice(0, MAX_SUGGESTIONS)
      .map(({ score: _score, ...suggestion }) => suggestion);
  }, [allProducts, categories, normalizedQuery, recentSearches]);

  const emptySuggestions = useMemo(() => {
    const relatedProducts = allProducts
      .map((product) => ({
        label: product.name,
        score: getProductSearchRank(product, normalizedQuery),
      }))
      .filter((item) => item.score <= 12)
      .sort((first, second) => first.score - second.score)
      .slice(0, 4)
      .map((item) => item.label);

    const aliasSuggestions = getSearchAliases(normalizedQuery)
      .filter((alias) => alias !== normalizedQuery)
      .slice(0, 3);

    return Array.from(new Set([...relatedProducts, ...aliasSuggestions])).slice(0, 4);
  }, [allProducts, normalizedQuery]);

  const didYouMean = useMemo(() => {
    if (!canShowCatalog || filteredProducts.length > 0) {
      return null;
    }

    return getDidYouMeanSuggestion(
      normalizedSearchTerm,
      allProducts.map((product) => product.name)
    );
  }, [allProducts, canShowCatalog, filteredProducts.length, normalizedSearchTerm]);

  const topSearchLabels = analytics.topSearches.map((item) => item.term);
  const topNoResultLabels = analytics.noResultSearches.map((item) => item.term);

  const isLoading = isLoadingAisles || (canShowCatalog && isLoadingProducts);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header compact={hasSearch} />

      <main
        className={`mx-auto flex w-full flex-1 flex-col px-4 ${
          hasSearch
            ? "max-w-6xl gap-8 py-10"
            : "max-w-5xl justify-center gap-10 pb-24"
        }`}
      >
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
          }}
          onSuggestionSelect={(value) => updateAnalytics("clickedSuggestions", value, 1)}
          suggestions={suggestions}
          autoFocus={!hasSearch}
        />

        {!hasSearch ? (
          <>
            <section className="mx-auto max-w-2xl text-center">
              <p className="text-lg text-foreground">
                Digite o nome, marca ou categoria para localizar um produto.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Exemplo: dipirona, vitamina C, protetor solar.
              </p>
            </section>

            {(topSearchLabels.length > 0 || topNoResultLabels.length > 0) ? (
              <section className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-card px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Buscas mais feitas
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topSearchLabels.length > 0 ? (
                      topSearchLabels.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchTerm(term)}
                          className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/10 hover:text-primary"
                        >
                          {term}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        As buscas mais populares aparecerao aqui.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-border/70 bg-card px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Termos sem resultado
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topNoResultLabels.length > 0 ? (
                      topNoResultLabels.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchTerm(term)}
                          className="rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                        >
                          {term}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Quando uma busca nao retornar nada, ela aparece aqui.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ) : null}
          </>
        ) : !canShowCatalog ? (
          <section className="mx-auto max-w-2xl text-center">
            <p className="text-lg text-foreground">
              Continue digitando para ver os produtos no catalogo.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Com 1 letra mostramos as sugestoes mais provaveis. A grade completa
              aparece a partir de 2 letras.
            </p>
          </section>
        ) : isLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            Buscando produtos...
          </p>
        ) : (
          <>
            <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resultados para</p>
                <h2 className="text-2xl font-semibold text-foreground">
                  "{normalizedSearchTerm}"
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} item(ns)
                </p>
                <p className="text-sm text-muted-foreground">
                  Reinicio automatico em {idleSecondsRemaining}s
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                  }}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Nova busca
                </button>
              </div>
            </section>

            <ProductGrid
              products={filteredProducts}
              aislesById={aislesById}
              searchTerm={normalizedSearchTerm}
              emptySuggestions={emptySuggestions}
              onSuggestionSelect={(value) => {
                setSearchTerm(value);
                updateAnalytics("clickedSuggestions", value, 1);
              }}
              didYouMean={didYouMean}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

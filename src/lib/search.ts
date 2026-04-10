import type { Product } from "@/types/catalog";

const synonymDictionary: Record<string, string[]> = {
  agua: ["agua micelar", "hidratacao", "limpeza facial"],
  dor: ["analgesico", "analgesicos", "dorflex", "dipirona", "paracetamol"],
  febre: ["dipirona", "paracetamol", "analgesico"],
  gripe: ["benegrip", "xarope", "pastilhas", "resfriado"],
  cabelo: ["shampoo", "condicionador", "gel fixador"],
  pele: ["dermocosmeticos", "serum", "protetor solar", "agua micelar"],
  pressao: ["medidor de pressao", "aparelho de pressao"],
  remedio: ["medicamento", "medicamentos otc", "analgesico"],
  vitamina: ["suplemento", "suplementos", "imunidade"],
  "vitamina c": ["imunidade", "suplemento"],
  "pasta de dente": ["creme dental"],
  "pasta dental": ["creme dental"],
  camisinha: ["preservativo"],
  "band aid": ["curativo"],
  glicose: ["glicosimetro", "diabetes", "tiras"],
  "acucar no sangue": ["glicosimetro", "diabetes"],
  "protetor labial": ["reparador labial", "labial"],
  "hidratante labial": ["reparador labial", "labial"],
  "dor de barriga": ["buscopan", "espasmo", "colica"],
  "nariz entupido": ["descongestionante", "soro nasal"],
  congestionamento: ["descongestionante nasal"],
  "fralda adulto": ["fralda geriatrica"],
  incontinencia: ["fralda geriatrica"],
  "sal de fruta": ["antiacido", "azia"],
  estomago: ["antiacido", "buscopan"],
};
const stopWords = new Set([
  "a",
  "as",
  "com",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "o",
  "os",
  "para",
  "por",
  "um",
  "uma",
]);

function uniqueTerms(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeSearchText(value: string) {
  return normalizeSearchText(value).split(" ").filter(Boolean);
}

export function includesWordStart(value: string, query: string) {
  return tokenizeSearchText(value).some((word) => word.startsWith(query));
}

function levenshteinDistance(source: string, target: string) {
  if (source === target) {
    return 0;
  }

  if (!source.length) {
    return target.length;
  }

  if (!target.length) {
    return source.length;
  }

  const previous = Array.from({ length: target.length + 1 }, (_, index) => index);
  const current = new Array<number>(target.length + 1).fill(0);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    current[0] = sourceIndex;

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const cost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;

      current[targetIndex] = Math.min(
        current[targetIndex - 1] + 1,
        previous[targetIndex] + 1,
        previous[targetIndex - 1] + cost
      );
    }

    for (let index = 0; index < previous.length; index += 1) {
      previous[index] = current[index];
    }
  }

  return previous[target.length];
}

function isFuzzyMatchToken(query: string, candidate: string) {
  if (query.length < 4 || Math.abs(query.length - candidate.length) > 2) {
    return false;
  }

  return levenshteinDistance(query, candidate) <= (query.length >= 7 ? 2 : 1);
}

export function getSearchAliases(query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const aliases = [normalizedQuery];
  const normalizedTokens = tokenizeSearchText(normalizedQuery).filter(
    (token) => !stopWords.has(token)
  );

  if (synonymDictionary[normalizedQuery]) {
    aliases.push(...synonymDictionary[normalizedQuery]);
  }

  for (const token of normalizedTokens) {
    aliases.push(token);

    if (synonymDictionary[token]) {
      aliases.push(...synonymDictionary[token]);
    }
  }

  for (const [key, values] of Object.entries(synonymDictionary)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      aliases.push(key, ...values);
    }

    if (normalizedTokens.some((token) => key.includes(token) || token.includes(key))) {
      aliases.push(key, ...values);
    }
  }

  return uniqueTerms(aliases.map(normalizeSearchText));
}

export function getDidYouMeanSuggestion(query: string, candidates: string[]) {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery.length < 3) {
    return null;
  }

  let bestSuggestion: { value: string; distance: number } | null = null;

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeSearchText(candidate);

    for (const token of tokenizeSearchText(normalizedCandidate)) {
      const distance = levenshteinDistance(normalizedQuery, token);

      if (distance > 2) {
        continue;
      }

      if (!bestSuggestion || distance < bestSuggestion.distance) {
        bestSuggestion = { value: candidate, distance };
      }
    }
  }

  return bestSuggestion?.value ?? null;
}

function getProductSearchFields(product: Product) {
  return {
    name: normalizeSearchText(product.name),
    brand: normalizeSearchText(product.brand),
    category: normalizeSearchText(product.category),
    description: normalizeSearchText(product.description),
    tags: (product.tags ?? []).map(normalizeSearchText),
  };
}

function hasFuzzyTokenMatch(query: string, values: string[]) {
  return values.some((value) =>
    tokenizeSearchText(value).some((token) => isFuzzyMatchToken(query, token))
  );
}

export function getProductSearchRank(product: Product, query: string) {
  const aliases = getSearchAliases(query);
  const primaryQuery = aliases[0] ?? "";
  const fields = getProductSearchFields(product);
  const fieldValues = [
    fields.name,
    fields.brand,
    fields.category,
    fields.description,
    ...fields.tags,
  ];

  for (const alias of aliases) {
    if (fields.name.startsWith(alias)) {
      return alias === primaryQuery ? 0 : 1;
    }
  }

  for (const alias of aliases) {
    if (includesWordStart(fields.name, alias)) {
      return alias === primaryQuery ? 2 : 3;
    }
  }

  for (const alias of aliases) {
    if (fields.brand.startsWith(alias) || fields.category.startsWith(alias)) {
      return alias === primaryQuery ? 4 : 5;
    }
  }

  for (const alias of aliases) {
    if (fields.tags.some((tag) => tag.startsWith(alias))) {
      return alias === primaryQuery ? 6 : 7;
    }
  }

  for (const alias of aliases) {
    if (fieldValues.some((value) => value.includes(alias))) {
      return alias === primaryQuery ? 8 : 9;
    }
  }

  if (hasFuzzyTokenMatch(primaryQuery, [fields.name])) {
    return 10;
  }

  if (hasFuzzyTokenMatch(primaryQuery, [fields.brand, fields.category, ...fields.tags])) {
    return 11;
  }

  if (hasFuzzyTokenMatch(primaryQuery, [fields.description])) {
    return 12;
  }

  return 99;
}

export function matchesSearchQuery(product: Product, query: string) {
  const aliases = getSearchAliases(query);
  const primaryQuery = aliases[0] ?? "";
  const fields = getProductSearchFields(product);
  const fieldValues = [
    fields.name,
    fields.brand,
    fields.category,
    fields.description,
    ...fields.tags,
  ];

  if (!primaryQuery) {
    return true;
  }

  if (primaryQuery.length === 1) {
    return (
      fields.name.startsWith(primaryQuery) ||
      fields.brand.startsWith(primaryQuery) ||
      fields.category.startsWith(primaryQuery) ||
      fields.tags.some((tag) => tag.startsWith(primaryQuery))
    );
  }

  if (aliases.some((alias) => fieldValues.some((value) => value.includes(alias)))) {
    return true;
  }

  return hasFuzzyTokenMatch(primaryQuery, [
    fields.name,
    fields.brand,
    fields.category,
    ...fields.tags,
  ]);
}

export function getHighlightParts(text: string, query: string) {
  const normalizedText = normalizeSearchText(text);
  const primaryQuery = normalizeSearchText(query);

  if (!primaryQuery) {
    return [{ text, highlighted: false }];
  }

  let start = -1;
  let length = 0;

  // Only highlight based on what the user actually typed, not expanded aliases
  const index = normalizedText.indexOf(primaryQuery);
  if (index >= 0) {
    start = index;
    length = primaryQuery.length;
  } else {
    // Try word-start match for the primary query
    const tokens = tokenizeSearchText(normalizedText);
    for (const token of tokens) {
      if (token.startsWith(primaryQuery)) {
        const tokenIndex = normalizedText.indexOf(token);
        if (tokenIndex >= 0) {
          start = tokenIndex;
          length = primaryQuery.length;
          break;
        }
      }
    }
  }

  if (start < 0) {
    const tokens = tokenizeSearchText(text);
    const fuzzyToken = tokens.find((token) => isFuzzyMatchToken(primaryQuery, token));

    if (!fuzzyToken) {
      return [{ text, highlighted: false }];
    }

    const fuzzyIndex = normalizedText.indexOf(fuzzyToken);

    if (fuzzyIndex < 0) {
      return [{ text, highlighted: false }];
    }

    start = fuzzyIndex;
    length = fuzzyToken.length;
  }

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let normalizedIndex = 0;
  let currentSegment = "";
  let currentHighlighted = false;

  for (const character of text) {
    const normalizedCharacter = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const shouldHighlight =
      normalizedCharacter.length > 0 &&
      normalizedIndex >= start &&
      normalizedIndex < start + length;

    if (currentSegment && currentHighlighted !== shouldHighlight) {
      parts.push({ text: currentSegment, highlighted: currentHighlighted });
      currentSegment = "";
    }

    currentSegment += character;
    currentHighlighted = shouldHighlight;
    normalizedIndex += normalizedCharacter.length;
  }

  if (currentSegment) {
    parts.push({ text: currentSegment, highlighted: currentHighlighted });
  }

  return parts;
}

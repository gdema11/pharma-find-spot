export interface Aisle {
  id: string;
  label: string;
  summary: string;
  description: string;
}

export type ProductAvailability =
  | "Em estoque"
  | "Ultimas unidades"
  | "Sob encomenda";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  priceInCents: number;
  stock: number;
  availability: ProductAvailability;
  tags?: string[];
}

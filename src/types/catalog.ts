export interface Aisle {
  id: string;
  label: string;
  summary: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  tags?: string[];
}

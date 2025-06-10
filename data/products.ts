import { getApiBaseUrl } from "../config/apiConfig";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  fullDescription?: string;
  specifications?: { [key: string]: string };
  inStock?: boolean;
  stockCount?: number;
  images?: string[];
}

export async function fetchProducts(): Promise<Product[]> {
  const API_URL = `${getApiBaseUrl()}/products`;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    // Handle both array root and {data: array}
    let products: any[] = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

    return products.map((p) => ({
      ...p,
      // Map snake_case to camelCase and set inStock correctly
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      fullDescription: p.full_description ?? p.fullDescription,
      stockCount: p.stock_count ?? p.stockCount ?? p.in_stock ?? 0,
      inStock: typeof p.in_stock === "number"
        ? p.in_stock > 0
        : typeof p.stock_count === "number"
        ? p.stock_count > 0
        : typeof p.inStock === "boolean"
        ? p.inStock
        : false,
      // Use camelCase consistently for frontend
    }));
  } catch (e) {
    console.warn("Could not fetch products:", e);
    return [];
  }
}
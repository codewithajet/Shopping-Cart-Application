import { getApiBaseUrl } from "../config/apiConfig";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category_id: number;
  category_name: string;
  description: string;
  rating: number;
  fullDescription?: string;
  specifications?: { [key: string]: string };
  inStock?: boolean;
  stockCount?: number;
  images?: string[];
}

export async function fetchProducts(params?: {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}): Promise<Product[]> {
  const API_URL = `${getApiBaseUrl()}/products`;
  const url = new URL(API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.append(key, value.toString());
    });
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    const products: any[] = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      image: p.image,
      category_id: p.category_id,
      category_name: p.category_name,
      description: p.description,
      rating: typeof p.rating === "string" ? parseFloat(p.rating) : p.rating,
      fullDescription: p.full_description ?? p.fullDescription,
      specifications: p.specifications,
      inStock: typeof p.in_stock === "number"
        ? p.in_stock > 0
        : typeof p.stock_count === "number"
        ? p.stock_count > 0
        : typeof p.inStock === "boolean"
        ? p.inStock
        : undefined,
      stockCount: p.stock_count ?? p.in_stock ?? undefined,
      images: p.images,
    }));
  } catch (e) {
    console.warn("Could not fetch products:", e);
    return [];
  }
}
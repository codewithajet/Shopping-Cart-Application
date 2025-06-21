import { getApiBaseUrl } from "../config/apiConfig";

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  icon?: string;
  productCount: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const API_URL = `${getApiBaseUrl()}/categories`;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
  } catch (e) {
    console.warn("Could not fetch categories:", e);
    return [];
  }
}
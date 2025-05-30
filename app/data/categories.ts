import { productsData } from './products';

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  icon?: string;
  productCount: number;
}

// Map through each category, count how many products match, and add productCount
export const categoriesData: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    description: 'Latest gadgets and tech accessories',
    icon: '📱',
    productCount: productsData.filter((p) => p.category === 'Electronics').length,
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    description: 'Trendy clothing and accessories',
    icon: '👗',
    productCount: productsData.filter((p) => p.category === 'Fashion').length,
  },
  {
    id: 3,
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    description: 'Beautiful items for your home',
    icon: '🏠',
    productCount: productsData.filter((p) => p.category === 'Home').length,
  },
  {
    id: 4,
    name: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Equipment for active lifestyle',
    icon: '⚽',
    productCount: productsData.filter((p) => p.category === 'Sports & Fitness').length,
  },
  {
    id: 5,
    name: 'Books & Media',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    description: 'Knowledge and entertainment',
    icon: '📚',
    productCount: productsData.filter((p) => p.category === 'Books & Media').length,
  },
  {
    id: 6,
    name: 'Beauty & Health',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    description: 'Care for your wellbeing',
    icon: '💄',
    productCount: productsData.filter((p) => p.category === 'Beauty & Health').length,
  },
];
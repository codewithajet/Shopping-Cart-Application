import React, { useState, useMemo } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductList from '../../components/ProductList';
import Cart from '../../components/Cart';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

// Define interfaces for our data types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterOptions {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating';
}

// Enhanced color scheme with gradients - moved before component
const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  primaryDark: '#667eea',
  secondary: '#f093fb',
  secondaryLight: '#f5576c',
  secondaryDark: '#4facfe',
  accent: '#43e97b',
  accentDark: '#38f9d7',
  textColor: '#2d3748',
  textLight: '#718096',
  textLighter: '#a0aec0',
  textDark: '#1a202c',
  backgroundMain: '#f7fafc',
  backgroundCard: '#ffffff',
  backgroundHover: '#edf2f7',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  // Gradient combinations
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  cardGradient: ['#ffffff', '#f8fafc'] as [string, string],
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
  secondaryGradient: ['#f093fb', '#f5576c'] as [string, string],
  darkGradient: ['#2d3748', '#4a5568'] as [string, string],
  // Design tokens
  borderRadius: 12,
  borderRadiusLarge: 20,
  shadowElevation: 8,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  spacingXxl: 48,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

const Index: React.FC = () => {
  // Sample product data with categories
  const [products] = useState<Product[]>([
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 89.99, 
      image: 'https://www-konga-com-res.cloudinary.com/w_500,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/R/W/63606_1720212597.jpg',
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation',
      rating: 4.5
    },
    { 
      id: 2, 
      name: 'Smartphone', 
      price: 699.99, 
      image: 'https://www.istore.com.ng/cdn/shop/files/iPhone_16_Pro_Max_Desert_Titanium_PDP_Image_Position_1__GBEN_269ea2e8-0fe7-4d8f-8650-b38ae80abf9c_2048x.png?v=1727182679',
      category: 'Electronics',
      description: 'Latest smartphone with advanced camera and fast processor',
      rating: 4.8
    },
    { 
      id: 3, 
      name: 'Laptop', 
      price: 1299.99, 
      image: 'https://i.ebayimg.com/images/g/r0sAAOSwJOpnJJ7Q/s-l1600.webp',
      category: 'Electronics',
      description: 'Powerful laptop for work and gaming',
      rating: 4.6
    },
    { 
      id: 4, 
      name: 'Smartwatch', 
      price: 249.99, 
      image: 'https://m.media-amazon.com/images/I/51-H5vPd+lL._AC_SY300_SX300_.jpg',
      category: 'Electronics',
      description: 'Feature-rich smartwatch with health monitoring',
      rating: 4.3
    },
    { 
      id: 5, 
      name: 'Bluetooth Speaker', 
      price: 59.99, 
      image: 'https://img.kwcdn.com/product/fancy/1a813d76-9ccf-4fa8-888b-ddf4f0dcfb91.jpg',
      category: 'Electronics',
      description: 'Portable Bluetooth speaker with great sound quality',
      rating: 4.2
    },
    { 
      id: 6, 
      name: 'Running Shoes', 
      price: 129.99, 
      image: 'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/88/2979973/1.jpg?3166',
      category: 'Fashion',
      description: 'Comfortable running shoes for daily exercise',
      rating: 4.4
    },
    { 
      id: 7, 
      name: 'Coffee Maker', 
      price: 89.99, 
      image: 'https://i5.walmartimages.com/seo/Mainstays-Black-5-Cup-Drip-Coffee-Maker-New_16f77040-27ab-4008-9852-59c900d7a7d9_1.c524f1d9c465e122596bf65f939c8d26.jpeg',
      category: 'Home',
      description: 'Automatic coffee maker with timer function',
      rating: 4.1
    },
    { 
      id: 8, 
      name: 'Desk Lamp', 
      price: 34.99, 
      image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/88/8822463/1.jpg?7796',
      category: 'Home',
      description: 'LED desk lamp with adjustable brightness',
      rating: 4.0
    },
  ]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: { min: 0, max: 2000 },
    sortBy: 'name'
  });

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      
      // Price range filter
      const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, searchQuery, filters]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, [products]);

  // Add item to cart
  const addToCart = (product: Product): void => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId: number): void => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  // Calculate total number of items in cart
  const cartItemsCount: number = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const cartTotal: number = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <LinearGradient
      colors={colors.backgroundGradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        
        <Header 
          cartItemsCount={cartItemsCount}
          onCartPress={() => setShowCart(!showCart)}
        />
        
        {!showCart && (
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
        )}
        
        {showCart ? (
          <Cart 
            items={cart}
            onAddItem={addToCart}
            onRemoveItem={removeFromCart}
            total={cartTotal}
            onClose={() => setShowCart(false)}
          />
        ) : (
          <ProductList 
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default Index;
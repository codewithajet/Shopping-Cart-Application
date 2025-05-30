import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../../components/CartContext';
import Cart from '../../components/Cart';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ProductList from '../../components/ProductList';
import { productsData, Product, FilterOptions } from '../data/products';

// Enhanced color scheme with gradients
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
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  cardGradient: ['#ffffff', '#f8fafc'] as [string, string],
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
  secondaryGradient: ['#f093fb', '#f5576c'] as [string, string],
  darkGradient: ['#2d3748', '#4a5568'] as [string, string],
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
  const router = useRouter();
  const { category: routeCategory } = useLocalSearchParams<{ category?: string }>();
  const { items: cart, addToCart } = useCart();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: routeCategory && typeof routeCategory === 'string' ? routeCategory : 'All',
    priceRange: { min: 0, max: 2000 },
    sortBy: 'name'
  });

  // When route category changes, update filter
  React.useEffect(() => {
    if (routeCategory && typeof routeCategory === 'string') {
      setFilters((prev) => ({ ...prev, category: routeCategory }));
    }
  }, [routeCategory]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let result = productsData.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter (from filter or from URL param)
      const matchesCategory =
        filters.category === 'All' ||
        product.category === filters.category;

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
  }, [searchQuery, filters]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, []);

  // Navigate to product detail
  const handleProductPress = (product: Product): void => {
    router.push(`/product/${product.id}`);
  };

  // Calculate total number of items in cart
  const cartItemsCount: number = cart.reduce((total, item) => total + item.quantity, 0);

  // Cart modal state
  const [showCart, setShowCart] = useState<boolean>(false);

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
            visible={showCart}
            onClose={() => setShowCart(false)}
          />
        ) : (
          <ProductList
            products={filteredProducts}
            onAddToCart={addToCart}
            onProductPress={handleProductPress}
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
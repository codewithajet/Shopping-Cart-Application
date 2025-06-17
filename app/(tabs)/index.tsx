import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Cart from '../../components/Cart';
import { useCart } from '../../components/CartContext';
import ProductList, { Product } from '../../components/ProductList';
import { fetchProducts } from '../../data/products';
import { fetchCategories, Category } from '../../data/categories';

export interface FilterOptions {
  category_id: number | null;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating';
}

const colors = {
  primary: '#667eea',
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
};

const Index: React.FC = () => {
  const { items: cart, addToCart } = useCart();

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category_id: null,
    priceRange: { min: 0, max: 2000 },
    sortBy: 'name'
  });

  // Fetch categories and then products
  useEffect(() => {
    setLoading(true);
    fetchCategories().then((cats) => {
      setCategories(cats ?? []);
      fetchProducts().then((products) => {
        setProductsData(products ?? []);
        setLoading(false);
      });
    });
  }, []);

  // Filtering logic (can be done on backend or here)
  const filteredProducts = useMemo(() => {
    let products = productsData;
    // Filter by category
    if (filters.category_id !== null) {
      products = products.filter(
        (p) => p.category_id === filters.category_id
      );
    }
    // Filter by search query
    if (searchQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Filter by price range
    products = products.filter(
      (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
    // Sort
    products = products.slice().sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return products;
  }, [searchQuery, filters, productsData]);

  const [showCart, setShowCart] = useState<boolean>(false);

  return (
    <LinearGradient
      colors={colors.backgroundGradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        <Header
          cartItemsCount={cart.reduce((total, item) => total + item.quantity, 0)}
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

        {loading ? (
          <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{color:colors.primary, marginTop:8}}>Loading products...</Text>
          </View>
        ) : showCart ? (
          <Cart
            visible={showCart}
            onClose={() => setShowCart(false)}
          />
        ) : (
          <ProductList
            products={filteredProducts}
            onAddToCart={(product) => addToCart(product, 1)}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
});

export default Index;
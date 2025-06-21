import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';
import { Product, fetchProducts } from '../data/products';
import ProductList from '../components/ProductList';
import { useCart } from '../components/CartContext';

const ProductsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const categoryId = params.category_id ? Number(params.category_id) : null;
  const router = useRouter();
  const { theme } = useAppTheme();
  const palette = Colors[theme];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProducts(categoryId ? { category_id: categoryId } : undefined)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <LinearGradient colors={palette.cardGradient as [string, string]} style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: palette.tint, textShadowColor: palette.accent }]}>Products</Text>
          <View style={[styles.underline, { backgroundColor: palette.tint }]} />
        </View>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={palette.tint} />
          </View>
        ) : (
          <ProductList
            products={products}
            onAddToCart={product => addToCart({ ...product, category: product.category_name }, 1)}
            onProductPress={product =>
              router.push({ pathname: '/product/[id]', params: { id: product.id } })
            }
            forcedTheme={theme}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  headerContainer: {
    paddingTop: 18,
    paddingBottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 29,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  underline: {
    height: 4,
    width: 60,
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.28,
    marginBottom: 10,
  },
});

export default ProductsScreen;
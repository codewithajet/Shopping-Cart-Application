import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../data/products';

export interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product & { category: string }) => void;
  onProductPress?: (product: Product) => void;
  forcedTheme?: 'light' | 'dark'; // Optional prop to force a specific theme
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

// Theme definitions
const lightTheme = {
  background: '#f9fafb',
  cardBackground: '#ffffff',
  cardGradient: ['#ffffff', '#f8fafc'] as [string, string],
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  iconContainer: '#f3f4f6',
  border: 'rgba(0,0,0,0.1)',
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

const darkTheme = {
  background: '#111827',
  cardBackground: '#1f2937',
  cardGradient: ['#1f2937', '#374151'] as [string, string],
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  iconContainer: '#374151',
  border: 'rgba(255,255,255,0.1)',
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

const commonColors = {
  primary: '#667eea',
  gradient: ['#667eea', '#764ba2'] as [string, string],
  success: '#10b981',
  warning: '#f59e0b',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  red: '#dc2626',
  // Spacing
  borderRadiusLarge: 20,
  borderRadiusMedium: 12,
  borderRadiusSmall: 8,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  // Typography
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onProductPress,
  forcedTheme,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = forcedTheme ? forcedTheme === 'dark' : systemColorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={commonColors.warning} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={commonColors.warning} />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons 
          key={`empty-${i}`} 
          name="star-outline" 
          size={12} 
          color={theme.textSecondary} 
        />
      );
    }
    return stars;
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const displayPrice =
      typeof item.price === 'number'
        ? item.price
        : typeof item.price === 'string'
        ? Number(item.price)
        : 0;

    const isInStock =
      typeof item.inStock === 'boolean'
        ? item.inStock
        : (typeof item.stockCount === 'number' ? item.stockCount > 0 : true);

    const dynamicStyles = createDynamicStyles(theme, isDark);

    return (
      <TouchableOpacity
        style={[styles.productCard, dynamicStyles.productCard]}
        onPress={() => onProductPress?.(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.cardGradient}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={[styles.categoryBadge, dynamicStyles.categoryBadge]}>
              <Text style={styles.categoryText}>{item.category_name}</Text>
            </View>
            {!isInStock && (
              <View style={[styles.outOfStockOverlay, dynamicStyles.outOfStockOverlay]}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={[styles.productName, dynamicStyles.productName]} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
              <Text style={[styles.ratingText, dynamicStyles.ratingText]}>
                ({item.rating})
              </Text>
            </View>

            <Text style={[styles.productDescription, dynamicStyles.productDescription]} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={[styles.price, dynamicStyles.price]}>
                ${displayPrice.toFixed(2)}
              </Text>
              <View style={[styles.stockBadge, isInStock ? dynamicStyles.inStockBadge : dynamicStyles.outOfStockBadge]}>
                <Text style={[styles.stockText, isInStock ? dynamicStyles.inStockText : dynamicStyles.outOfStockText]}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={e => {
                e.stopPropagation?.();
                if (isInStock) onAddToCart({ ...item, category: item.category_name });
              }}
              style={[styles.addButton, !isInStock && styles.disabledButton]}
              disabled={!isInStock}
            >
              <LinearGradient
                colors={isInStock ? commonColors.gradient : [theme.textSecondary, theme.textSecondary]}
                style={styles.addButtonGradient}
              >
                <Ionicons
                  name={isInStock ? "cart" : "ban"}
                  size={16}
                  color="white"
                  style={styles.cartIcon}
                />
                <Text style={styles.addButtonText}>
                  {isInStock ? 'Add to Cart' : 'Unavailable'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const dynamicStyles = createDynamicStyles(theme, isDark);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const createDynamicStyles = (theme: typeof lightTheme, isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
  },
  productCard: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    ...theme.shadow,
  },
  categoryBadge: {
    backgroundColor: isDark ? commonColors.primary : commonColors.primary,
    shadowColor: isDark ? commonColors.primary : 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0,
    shadowRadius: 4,
  },
  outOfStockOverlay: {
    backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
  },
  productName: {
    color: theme.textPrimary,
  },
  ratingText: {
    color: theme.textSecondary,
  },
  productDescription: {
    color: theme.textSecondary,
  },
  price: {
    color: commonColors.primary,
  },
  inStockBadge: {
    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    borderColor: commonColors.success,
  },
  outOfStockBadge: {
    backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)',
    borderColor: commonColors.red,
  },
  inStockText: {
    color: commonColors.success,
  },
  outOfStockText: {
    color: commonColors.red,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: commonColors.spacingMd,
    paddingBottom: commonColors.spacingLg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: commonColors.spacingMd,
  },
  productCard: {
    width: itemWidth,
    borderRadius: commonColors.borderRadiusLarge,
    marginBottom: commonColors.spacingMd,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: commonColors.borderRadiusLarge,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: commonColors.spacingSm,
    left: commonColors.spacingSm,
    paddingHorizontal: commonColors.spacingSm,
    paddingVertical: commonColors.spacingXs,
    borderRadius: commonColors.borderRadiusSmall,
  },
  categoryText: {
    color: 'white',
    fontSize: commonColors.fontSizeXs,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: commonColors.borderRadiusLarge,
  },
  outOfStockText: {
    color: '#dc2626',
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightBold,
    textAlign: 'center',
  },
  productInfo: {
    padding: commonColors.spacingMd,
  },
  productName: {
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightBold,
    marginBottom: commonColors.spacingSm,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: commonColors.spacingSm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: commonColors.spacingXs,
  },
  ratingText: {
    fontSize: commonColors.fontSizeXs,
    fontWeight: commonColors.fontWeightMedium,
  },
  productDescription: {
    fontSize: commonColors.fontSizeSm,
    marginBottom: commonColors.spacingMd,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: commonColors.spacingMd,
  },
  price: {
    fontSize: commonColors.fontSizeLg,
    fontWeight: commonColors.fontWeightBold,
  },
  stockBadge: {
    paddingHorizontal: commonColors.spacingSm,
    paddingVertical: commonColors.spacingXs,
    borderRadius: commonColors.borderRadiusSmall,
    borderWidth: 1,
  },
  stockText: {
    fontSize: commonColors.fontSizeXs,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  addButton: {
    borderRadius: commonColors.borderRadiusMedium,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: commonColors.spacingMd,
    paddingHorizontal: commonColors.spacingMd,
  },
  cartIcon: {
    marginRight: commonColors.spacingXs,
  },
  addButtonText: {
    color: 'white',
    fontSize: commonColors.fontSizeSm,
    fontWeight: commonColors.fontWeightSemiBold,
  },
});

export default ProductList;
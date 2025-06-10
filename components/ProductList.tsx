import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

export interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  secondary: '#f093fb',
  accent: '#43e97b',
  textColor: '#2d3748',
  textLight: '#718096',
  textLighter: '#a0aec0',
  backgroundCard: '#ffffff',
  backgroundHover: '#edf2f7',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  warning: '#f59e0b',
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  borderRadius: 12,
  borderRadiusLarge: 20,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onProductPress,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={colors.warning} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={colors.warning} />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color={colors.textLighter} />
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

    // Defensive: treat 0 or undefined/false stock as Out of Stock
    const isInStock =
      typeof item.inStock === 'boolean'
        ? item.inStock
        : (typeof item.stockCount === 'number' ? item.stockCount > 0 : true); // Default to true

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => onProductPress?.(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.cardGradient}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.ratingText}>({item.rating})</Text>
            </View>

            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${displayPrice.toFixed(2)}
              </Text>
              {isInStock
                ? <Text style={styles.stockText}>In Stock</Text>
                : <Text style={[styles.stockText, { color: colors.textLight }]}>Out of Stock</Text>
              }
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                if (isInStock) onAddToCart(item);
              }}
              style={styles.addButton}
              disabled={!isInStock}
            >
              <LinearGradient
                colors={isInStock ? colors.buttonGradient : [colors.textLighter, colors.textLighter]}
                style={styles.addButtonGradient}
              >
                <Ionicons
                  name="cart"
                  size={16}
                  color="white"
                  style={styles.cartIcon}
                />
                <Text style={styles.addButtonText}>
                  {isInStock ? 'Add' : 'Out of Stock'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContainer: {
    padding: colors.spacingMd,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: colors.spacingMd,
  },
  productCard: {
    width: itemWidth,
    borderRadius: colors.borderRadiusLarge,
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: colors.backgroundCard,
    marginBottom: colors.spacingMd,
  },
  cardGradient: {
    borderRadius: colors.borderRadiusLarge,
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
    top: colors.spacingSm,
    left: colors.spacingSm,
    backgroundColor: colors.primary,
    paddingHorizontal: colors.spacingSm,
    paddingVertical: colors.spacingXs,
    borderRadius: colors.spacingXs,
  },
  categoryText: {
    color: 'white',
    fontSize: colors.fontSizeXs,
    fontWeight: colors.fontWeightSemiBold,
  },
  productInfo: {
    padding: colors.spacingMd,
  },
  productName: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginBottom: colors.spacingSm,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingSm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: colors.spacingXs,
  },
  ratingText: {
    fontSize: colors.fontSizeXs,
    color: colors.textLight,
    fontWeight: colors.fontWeightMedium,
  },
  productDescription: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
    marginBottom: colors.spacingMd,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: colors.spacingMd,
  },
  price: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.primary,
  },
  stockText: {
    fontSize: colors.fontSizeXs,
    color: colors.accent,
    fontWeight: colors.fontWeightSemiBold,
  },
  addButton: {
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: colors.spacingSm,
    paddingHorizontal: colors.spacingMd,
  },
  cartIcon: {
    marginRight: colors.spacingXs,
  },
  addButtonText: {
    color: 'white',
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightSemiBold,
  },
});

export default ProductList;
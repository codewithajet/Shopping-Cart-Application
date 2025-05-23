import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with padding

// Enhanced color scheme
const colors = {
  primary: '#3f51b5',
  primaryLight: '#757de8',
  primaryDark: '#002984',
  secondary: '#ff4081',
  secondaryLight: '#ff79b0',
  secondaryDark: '#c60055',
  accent: '#00bcd4',
  accentLight: '#62efff',
  textColor: '#2c3e50',
  textLight: '#7f8c8d',
  textLighter: '#bdc3c7',
  backgroundMain: '#f8fafc',
  backgroundCard: '#ffffff',
  backgroundHover: '#f1f5f9',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  success: '#10b981',
  warning: '#f59e0b',
  borderRadius: 16,
  borderRadiusLg: 20,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 17,
  fontSizeXl: 19,
  fontSizeXxl: 22,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

const ProductCard: React.FC<{ item: Product; onAddToCart: (product: Product) => void }> = ({ 
  item, 
  onAddToCart 
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [addButtonScale] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAddToCart(item);
    });
  };

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

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      electronics: colors.primary,
      clothing: colors.secondary,
      books: colors.accent,
      home: colors.success,
    };
    return categoryColors[category.toLowerCase()] || colors.primary;
  };

  return (
    <Animated.View style={[styles.productCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        {/* Image Container with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.03)']}
            style={styles.imageGradient}
          />
          
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          
          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
            <View style={styles.favoriteButtonInner}>
              <Ionicons name="heart-outline" size={16} color={colors.textColor} />
            </View>
          </TouchableOpacity>
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color={colors.warning} />
            <Text style={styles.ratingBadgeText}>{item.rating}</Text>
          </View>
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Full Rating Display */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.ratingText}>({item.rating})</Text>
            <View style={styles.ratingDivider} />
            <Text style={styles.stockText}>In Stock</Text>
          </View>
          
          {/* Price and Add Button */}
          <View style={styles.priceContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${(item.price * 1.2).toFixed(2)}</Text>
            </View>
            
            <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  style={styles.addButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="add" size={18} color={colors.backgroundCard} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Subtle Bottom Highlight */}
      <View style={styles.cardHighlight} />
    </Animated.View>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={[colors.primaryLight, colors.primary]}
            style={styles.emptyIconGradient}
          >
            <Ionicons name="search" size={48} color={colors.backgroundCard} />
          </LinearGradient>
        </View>
        <Text style={styles.emptyTitle}>No products found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters to find what you&apos;re looking for
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard item={item} onAddToCart={onAddToCart} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      bounces={true}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: colors.spacingMd,
    paddingBottom: colors.spacingXl,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: colors.spacingMd,
  },
  productCard: {
    width: itemWidth,
    backgroundColor: colors.backgroundCard,
    borderRadius: colors.borderRadius,
    marginBottom: colors.spacingMd,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundHover,
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  categoryBadge: {
    position: 'absolute',
    top: colors.spacingSm,
    left: colors.spacingSm,
    paddingHorizontal: colors.spacingSm,
    paddingVertical: colors.spacingXs,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryText: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeXs - 1,
    fontWeight: colors.fontWeightBold,
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: colors.spacingSm,
    right: colors.spacingSm,
  },
  favoriteButtonInner: {
    backgroundColor: colors.backgroundCard,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: colors.spacingSm,
    right: colors.spacingSm,
    backgroundColor: colors.backgroundCard,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingBadgeText: {
    fontSize: colors.fontSizeXs - 1,
    fontWeight: colors.fontWeightSemiBold,
    color: colors.textColor,
    marginLeft: 2,
  },
  productInfo: {
    padding: colors.spacingMd,
  },
  productName: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginBottom: colors.spacingXs,
    lineHeight: 20,
  },
  productDescription: {
    fontSize: colors.fontSizeXs,
    color: colors.textLight,
    marginBottom: colors.spacingSm,
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingMd,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: colors.spacingXs,
  },
  ratingText: {
    fontSize: colors.fontSizeXs - 1,
    color: colors.textLight,
    fontWeight: colors.fontWeightMedium,
  },
  ratingDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.borderColor,
    marginHorizontal: colors.spacingXs,
  },
  stockText: {
    fontSize: colors.fontSizeXs - 1,
    color: colors.success,
    fontWeight: colors.fontWeightSemiBold,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flex: 1,
  },
  price: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: colors.fontSizeXs,
    color: colors.textLighter,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addButton: {
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 20,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHighlight: {
    position: 'absolute',
    bottom: 0,
    left: colors.spacingMd,
    right: colors.spacingMd,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.1,
    borderRadius: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: colors.spacingXl,
    paddingVertical: colors.spacingXl * 2,
  },
  emptyIconContainer: {
    marginBottom: colors.spacingLg,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginBottom: colors.spacingSm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});

export default ProductList;
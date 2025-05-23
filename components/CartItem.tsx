import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating: number;
    quantity: number;
  };
  onIncrease: () => void;
  onDecrease: () => void;
}

const { width } = Dimensions.get('window');

// Color palette
const colors = {
  primary: '#3f51b5',
  primaryLight: '#757de8',
  primaryDark: '#002984',
  secondary: '#ff4081',
  secondaryLight: '#ff79b0',
  secondaryDark: '#c60055',
  textColor: '#333',
  textLight: '#666',
  textLighter: '#888',
  backgroundMain: '#f5f7fa',
  backgroundCard: '#fff',
  backgroundHover: '#f0f2f5',
  borderColor: '#e1e4e8',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  borderRadius: 12,
  borderRadiusLg: 16,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontWeightMedium: '500' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));

  const animatePress = () => {
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

  const handleRemove = () => {
    if (item.quantity === 1) {
      Alert.alert(
        'Remove Item',
        `Remove "${item.name}" from your cart?`,
        [
          { text: 'Keep It', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => onDecrease());
            }
          },
        ]
      );
    } else {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    animatePress();
    onIncrease();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color={colors.secondary} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color={colors.secondary} />
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Main Card */}
      <View style={styles.card}>
        {/* Product Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {item.quantity > 1 && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>{item.quantity}x</Text>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {
                // Add to favorites functionality
                Alert.alert('💝 Added to Favorites', 'You can find this item in your favorites list!');
              }}
            >
              <Ionicons name="heart-outline" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.ratingText}>({item.rating})</Text>
            <View style={styles.ratingDivider} />
            <Text style={styles.inStockText}>✅ In Stock</Text>
          </View>

          {/* Price and Quantity Controls */}
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
              {item.quantity > 1 && (
                <Text style={styles.totalPrice}>
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </Text>
              )}
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, styles.decreaseButton]}
                onPress={handleRemove}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={item.quantity === 1 ? "trash-outline" : "remove"} 
                  size={16} 
                  color={item.quantity === 1 ? colors.secondaryDark : colors.primary} 
                />
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>

              <TouchableOpacity
                style={[styles.quantityButton, styles.increaseButton]}
                onPress={handleIncrease}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.increaseGradient}
                >
                  <Ionicons name="add" size={16} color={colors.backgroundCard} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Subtle Shadow Effect */}
      <View style={styles.shadowOverlay} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: colors.spacingMd,
    marginVertical: colors.spacingSm,
    borderRadius: colors.borderRadiusLg,
    backgroundColor: colors.backgroundCard,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    flexDirection: 'row',
    padding: colors.spacingMd,
    backgroundColor: colors.backgroundCard,
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    marginRight: colors.spacingMd,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: colors.borderRadius,
    backgroundColor: colors.backgroundMain,
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: colors.spacingSm,
    paddingVertical: 2,
    borderRadius: colors.spacingSm,
  },
  categoryText: {
    color: colors.backgroundCard,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quantityBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  quantityBadgeText: {
    color: colors.backgroundCard,
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: colors.fontSizeMd,
    fontWeight: '600',
    color: colors.textColor,
    marginRight: colors.spacingSm,
  },
  favoriteButton: {
    padding: 4,
  },
  productDescription: {
    fontSize: colors.fontSizeSm - 1,
    color: colors.textLight,
    marginBottom: colors.spacingSm,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingSm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: colors.fontSizeXs,
    color: colors.textLight,
    marginRight: colors.spacingSm,
  },
  ratingDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.borderColor,
    marginRight: colors.spacingSm,
  },
  inStockText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  currentPrice: {
    fontSize: colors.fontSizeLg,
    fontWeight: 'bold',
    color: colors.textColor,
  },
  totalPrice: {
    fontSize: colors.fontSizeSm - 1,
    color: colors.textLight,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundMain,
    borderRadius: colors.borderRadius,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButton: {
    backgroundColor: colors.backgroundCard,
  },
  increaseButton: {
    overflow: 'hidden',
  },
  increaseGradient: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 40,
    alignitems: 'center',
    paddingHorizontal: colors.spacingSm,
  },
  quantityText: {
    fontSize: colors.fontSizeMd,
    fontWeight: '600',
    color: colors.textColor,
  },
  shadowOverlay: {
    position: 'absolute',
    bottom: -2,
    left: colors.spacingSm,
    right: colors.spacingSm,
    height: 4,
    backgroundColor: colors.primary,
    opacity: 0.05,
    borderRadius: colors.borderRadiusLg,
    zIndex: -1,
  },
});

export default CartItem;
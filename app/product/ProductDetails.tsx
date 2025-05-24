import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Product {
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

const { width, height } = Dimensions.get('window');

// Enhanced color scheme matching your existing design
const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  primaryDark: '#5a67d8',
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
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  // Gradients
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  cardGradient: ['#ffffff', '#f8fafc'] as [string, string],
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
  secondaryGradient: ['#f093fb', '#f5576c'] as [string, string],
  // Design tokens
  borderRadius: 12,
  borderRadiusLarge: 20,
  borderRadiusXLarge: 28,
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
  fontSizeXxxl: 28,
  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addToCartAnimation] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Move sample products outside of useEffect to avoid dependency issues
  const sampleProducts: Product[] = useMemo(() => [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 89.99,
      image: 'https://www-konga-com-res.cloudinary.com/w_500,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/R/W/63606_1720212597.jpg',
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation',
      rating: 4.5,
      fullDescription: 'Experience premium audio quality with these state-of-the-art wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and crystal-clear sound reproduction. Perfect for music lovers, professionals, and anyone who demands the best in audio technology.',
      specifications: {
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Bluetooth Version': '5.2',
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Weight': '250g',
        'Warranty': '2 years'
      },
      inStock: true,
      stockCount: 15,
      images: [
        'https://www-konga-com-res.cloudinary.com/w_500,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/product/R/W/63606_1720212597.jpg',
        'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UF894,1000_QL80_.jpg',
        'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UF350,350_QL80_.jpg'
      ]
    },
    {
      id: 2,
      name: 'Latest Smartphone Pro',
      price: 699.99,
      image: 'https://www.istore.com.ng/cdn/shop/files/iPhone_16_Pro_Max_Desert_Titanium_PDP_Image_Position_1__GBEN_269ea2e8-0fe7-4d8f-8650-b38ae80abf9c_2048x.png?v=1727182679',
      category: 'Electronics',
      description: 'Latest smartphone with advanced camera and fast processor',
      rating: 4.8,
      fullDescription: 'The ultimate smartphone experience with cutting-edge technology. Features a professional-grade camera system, lightning-fast processor, all-day battery life, and stunning display. Built with premium materials and designed for those who demand excellence.',
      specifications: {
        'Display': '6.7" Super Retina XDR',
        'Processor': 'A17 Pro Chip',
        'Storage': '256GB',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': '4441 mAh',
        'OS': 'iOS 17',
        'Weight': '221g'
      },
      inStock: true,
      stockCount: 8,
      images: [
        'https://www.istore.com.ng/cdn/shop/files/iPhone_16_Pro_Max_Desert_Titanium_PDP_Image_Position_1__GBEN_269ea2e8-0fe7-4d8f-8650-b38ae80abf9c_2048x.png?v=1727182679',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1724041320471',
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-bluetitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1724041320471'
      ]
    }
  ], []);

  // Create animation function to avoid recreating it in useEffect
  const startAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    // Find product by ID
    const foundProduct = sampleProducts.find(p => p.id === parseInt(id as string));
    setProduct(foundProduct || null);

    // Animate entrance
    startAnimations();
  }, [id, sampleProducts, startAnimations]);

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color={colors.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color={colors.warning} />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color={colors.textLighter} />
      );
    }

    return stars;
  }, []);

  const handleAddToCart = useCallback(() => {
    Animated.sequence([
      Animated.timing(addToCartAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addToCartAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Here you would typically dispatch to your cart context/store
    console.log(`Added ${quantity} ${product?.name} to cart`);
  }, [addToCartAnimation, quantity, product?.name]);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const handleQuantityDecrease = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const handleQuantityIncrease = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const handleScrollEnd = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setSelectedImageIndex(index);
  }, []);

  if (!product) {
    return (
      <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Product not found</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentImages = product.images || [product.image];

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={colors.backgroundCard} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Product Details</Text>
          
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.headerButton}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? colors.error : colors.backgroundCard}
            />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            {/* Image Gallery */}
            <View style={styles.imageSection}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
              >
                {currentImages.map((imageUrl, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.1)']}
                      style={styles.imageGradient}
                    />
                  </View>
                ))}
              </ScrollView>
              
              {/* Image Indicators */}
              {currentImages.length > 1 && (
                <View style={styles.imageIndicators}>
                  {currentImages.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === selectedImageIndex && styles.activeIndicator
                      ]}
                    />
                  ))}
                </View>
              )}
              
              {/* Category Badge */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
              </View>
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(product.rating)}
                  </View>
                  <Text style={styles.ratingText}>({product.rating})</Text>
                </View>
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                <Text style={styles.originalPrice}>${(product.price * 1.2).toFixed(2)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>17% OFF</Text>
                </View>
              </View>

              {/* Stock Status */}
              <View style={styles.stockContainer}>
                <Ionicons 
                  name={product.inStock ? "checkmark-circle" : "close-circle"} 
                  size={16} 
                  color={product.inStock ? colors.success : colors.error} 
                />
                <Text style={[
                  styles.stockText,
                  { color: product.inStock ? colors.success : colors.error }
                ]}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </Text>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {product.fullDescription || product.description}
                </Text>
              </View>

              {/* Specifications */}
              {product.specifications && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Specifications</Text>
                  <View style={styles.specificationsContainer}>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <View key={index} style={styles.specificationRow}>
                        <Text style={styles.specKey}>{key}</Text>
                        <Text style={styles.specValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Quantity Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={handleQuantityDecrease}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{quantity}</Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={handleQuantityIncrease}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <Animated.View 
          style={[
            styles.actionBar,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={colors.cardGradient}
            style={styles.actionBarGradient}
          >
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                ${(product.price * quantity).toFixed(2)}
              </Text>
            </View>
            
            <Animated.View style={{ transform: [{ scale: addToCartAnimation }] }}>
              <TouchableOpacity
                onPress={handleAddToCart}
                style={styles.addToCartButton}
                disabled={!product.inStock}
              >
                <LinearGradient
                  colors={product.inStock ? colors.buttonGradient : [colors.textLighter, colors.textLighter]}
                  style={styles.addToCartGradient}
                >
                  <Ionicons 
                    name="cart" 
                    size={20} 
                    color={colors.backgroundCard} 
                    style={styles.cartIcon}
                  />
                  <Text style={styles.addToCartText}>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: colors.fontSizeXl,
    color: colors.backgroundCard,
    marginBottom: colors.spacingLg,
  },
  backButton: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingMd,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.backgroundCard,
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    position: 'relative',
    height: height * 0.4,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: colors.spacingLg,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.backgroundCard,
    width: 20,
  },
  categoryBadge: {
    position: 'absolute',
    top: colors.spacingLg,
    left: colors.spacingMd,
    backgroundColor: colors.primary,
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    borderRadius: colors.borderRadius,
  },
  categoryText: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeXs,
    fontWeight: colors.fontWeightBold,
    letterSpacing: 0.5,
  },
  productInfo: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: colors.borderRadiusXLarge,
    borderTopRightRadius: colors.borderRadiusXLarge,
    paddingHorizontal: colors.spacingLg,
    paddingTop: colors.spacingXl,
    paddingBottom: colors.spacingXxl,
    marginTop: -colors.borderRadiusXLarge,
  },
  productHeader: {
    marginBottom: colors.spacingLg,
  },
  productName: {
    fontSize: colors.fontSizeXxxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.textColor,
    marginBottom: colors.spacingMd,
    lineHeight: 34,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: colors.spacingSm,
  },
  ratingText: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    fontWeight: colors.fontWeightMedium,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingLg,
  },
  price: {
    fontSize: colors.fontSizeXxxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.primary,
    marginRight: colors.spacingMd,
  },
  originalPrice: {
    fontSize: colors.fontSizeLg,
    color: colors.textLighter,
    textDecorationLine: 'line-through',
    marginRight: colors.spacingMd,
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: colors.spacingSm,
    paddingVertical: colors.spacingXs,
    borderRadius: 6,
  },
  discountText: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeXs,
    fontWeight: colors.fontWeightBold,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingXl,
  },
  stockText: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightSemiBold,
    marginLeft: colors.spacingSm,
  },
  section: {
    marginBottom: colors.spacingXl,
  },
  sectionTitle: {
    fontSize: colors.fontSizeXl,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginBottom: colors.spacingMd,
  },
  description: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    lineHeight: 24,
  },
  specificationsContainer: {
    backgroundColor: colors.backgroundHover,
    borderRadius: colors.borderRadius,
    padding: colors.spacingMd,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: colors.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  specKey: {
    fontSize: colors.fontSizeMd,
    color: colors.textColor,
    fontWeight: colors.fontWeightMedium,
    flex: 1,
  },
  specValue: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    flex: 1,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundHover,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  quantityDisplay: {
    backgroundColor: colors.primary,
    marginHorizontal: colors.spacingMd,
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
    minWidth: 60,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.backgroundCard,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingLg,
    paddingBottom: colors.spacingXl,
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.primary,
  },
  addToCartButton: {
    borderRadius: colors.borderRadiusLarge,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingXl,
    paddingVertical: colors.spacingLg,
    borderRadius: colors.borderRadiusLarge,
    minWidth: 160,
    justifyContent: 'center',
  },
  cartIcon: {
    marginRight: colors.spacingSm,
  },
  addToCartText: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.backgroundCard,
  },
});

export default ProductDetail;
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
import { useCart } from './CartContext';
import Cart from './Cart';

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

const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  primaryDark: '#667eea',
  secondary: '#f093fb',
  secondaryLight: '#f5576c',
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
  warning: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  cardGradient: ['#ffffff', '#f8fafc'] as [string, string],
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
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
  fontSizeXxxl: 28,
  fontWeightNormal: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useCart();

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  // Sample products data
  const products: Product[] = [
      { 
      id: 1, 
      name: 'Wireless Headphones', 
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
      name: 'Smartphone', 
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
    },
    { 
      id: 3, 
      name: 'Laptop', 
      price: 1299.99, 
      image: 'https://i.ebayimg.com/images/g/r0sAAOSwJOpnJJ7Q/s-l1600.webp',
      category: 'Electronics',
      description: 'Powerful laptop for work and gaming',
      rating: 4.6,
      fullDescription: 'High-performance laptop designed for professionals and gamers alike. Features the latest processor, dedicated graphics, fast SSD storage, and a stunning display. Perfect for demanding applications, creative work, and immersive gaming experiences.',
      specifications: {
        'Processor': 'Intel Core i7-13700H',
        'RAM': '16GB DDR5',
        'Storage': '1TB NVMe SSD',
        'Graphics': 'NVIDIA RTX 4060',
        'Display': '15.6" 144Hz IPS',
        'Battery': '90Wh',
        'Weight': '2.3kg'
      },
      inStock: true,
      stockCount: 12,
      images: [
        'https://i.ebayimg.com/images/g/r0sAAOSwJOpnJJ7Q/s-l1600.webp',
        'https://m.media-amazon.com/images/I/61Qe0euJJZL._AC_UF894,1000_QL80_.jpg'
      ]
    },
    { 
      id: 4, 
      name: 'Smartwatch', 
      price: 249.99, 
      image: 'https://m.media-amazon.com/images/I/51-H5vPd+lL._AC_SY300_SX300_.jpg',
      category: 'Electronics',
      description: 'Feature-rich smartwatch with health monitoring',
      rating: 4.3,
      fullDescription: 'Advanced smartwatch with comprehensive health tracking, fitness monitoring, and smart connectivity features. Track your workouts, monitor your health metrics, receive notifications, and stay connected throughout your day.',
      specifications: {
        'Display': '1.9" AMOLED',
        'Battery Life': '7 days',
        'Water Resistance': '5ATM',
        'Sensors': 'Heart Rate, SpO2, GPS',
        'Connectivity': 'Bluetooth 5.3, WiFi',
        'Storage': '32GB',
        'Weight': '42g'
      },
      inStock: true,
      stockCount: 20,
      images: [
        'https://m.media-amazon.com/images/I/51-H5vPd+lL._AC_SY300_SX300_.jpg',
        'https://m.media-amazon.com/images/I/61ZjlBOp+rL._AC_UF894,1000_QL80_.jpg'
      ]
    },
    { 
      id: 5, 
      name: 'Bluetooth Speaker', 
      price: 59.99, 
      image: 'https://img.kwcdn.com/product/fancy/1a813d76-9ccf-4fa8-888b-ddf4f0dcfb91.jpg',
      category: 'Electronics',
      description: 'Portable Bluetooth speaker with great sound quality',
      rating: 4.2,
      fullDescription: 'Compact yet powerful Bluetooth speaker delivering exceptional sound quality. Features 360-degree sound, waterproof design, and long-lasting battery. Perfect for outdoor adventures, home entertainment, and on-the-go music.',
      specifications: {
        'Output Power': '20W',
        'Battery Life': '12 hours',
        'Bluetooth Range': '30 meters',
        'Water Rating': 'IPX7',
        'Frequency Response': '60Hz - 20kHz',
        'Charging Time': '3 hours',
        'Weight': '680g'
      },
      inStock: true,
      stockCount: 25,
      images: [
        'https://img.kwcdn.com/product/fancy/1a813d76-9ccf-4fa8-888b-ddf4f0dcfb91.jpg'
      ]
    },
    { 
      id: 6, 
      name: 'Running Shoes', 
      price: 129.99, 
      image: 'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/88/2979973/1.jpg?3166',
      category: 'Fashion',
      description: 'Comfortable running shoes for daily exercise',
      rating: 4.4,
      fullDescription: 'Premium running shoes engineered for comfort and performance. Features advanced cushioning technology, breathable materials, and durable construction. Designed to support your feet during long runs and intense training sessions.',
      specifications: {
        'Upper Material': 'Breathable Mesh',
        'Sole Type': 'EVA Foam',
        'Drop': '10mm',
        'Weight': '280g per shoe',
        'Support Type': 'Neutral',
        'Terrain': 'Road Running',
        'Sizes': 'US 6-13'
      },
      inStock: true,
      stockCount: 18,
      images: [
        'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/88/2979973/1.jpg?3166'
      ]
    },
    { 
      id: 7, 
      name: 'Coffee Maker', 
      price: 89.99, 
      image: 'https://i5.walmartimages.com/seo/Mainstays-Black-5-Cup-Drip-Coffee-Maker-New_16f77040-27ab-4008-9852-59c900d7a7d9_1.c524f1d9c465e122596bf65f939c8d26.jpeg',
      category: 'Home',
      description: 'Automatic coffee maker with timer function',
      rating: 4.1,
      fullDescription: 'Convenient automatic coffee maker with programmable timer and multiple brewing options. Features a thermal carafe, auto-shutoff, and easy-to-use controls. Start your day with perfectly brewed coffee every time.',
      specifications: {
        'Capacity': '12 cups',
        'Carafe Type': 'Thermal Stainless Steel',
        'Programmable': 'Yes, 24-hour timer',
        'Auto Shutoff': 'Yes, 2 hours',
        'Water Filter': 'Built-in',
        'Dimensions': '14" x 10" x 12"',
        'Power': '1200W'
      },
      inStock: true,
      stockCount: 14,
      images: [
        'https://i5.walmartimages.com/seo/Mainstays-Black-5-Cup-Drip-Coffee-Maker-New_16f77040-27ab-4008-9852-59c900d7a7d9_1.c524f1d9c465e122596bf65f939c8d26.jpeg'
      ]
    },
    { 
      id: 8, 
      name: 'Desk Lamp', 
      price: 34.99, 
      image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/88/8822463/1.jpg?7796',
      category: 'Home',
      description: 'LED desk lamp with adjustable brightness',
      rating: 4.0,
      fullDescription: 'Modern LED desk lamp with adjustable brightness and color temperature. Features touch controls, USB charging port, and flexible arm design. Perfect for reading, studying, and workspace illumination.',
      specifications: {
        'Light Source': 'LED',
        'Power': '12W',
        'Brightness Levels': '5 levels',
        'Color Temperature': '3000K-6500K',
        'USB Port': 'Yes, 5V/1A',
        'Arm Length': '40cm',
        'Base Diameter': '18cm'
      },
      inStock: true,
      stockCount: 22,
      images: [
        'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/88/8822463/1.jpg?7796'
      ]
    },
  ];

  useEffect(() => {
    const productId = parseInt(id as string);
    const foundProduct = products.find(p => p.id === productId);
    setProduct(foundProduct || null);
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
  }, [id, fadeAnim, slideAnim]);

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
    if (product && product.inStock) {
      addToCart(product, quantity);
      setShowCart(true);
    }
  }, [product, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (product && product.inStock) {
      addToCart(product, quantity);
      setShowCart(true);
    }
  }, [product, quantity, addToCart]);

  if (!product) {
    return (
      <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={colors.danger} />
            <Text style={styles.errorText}>Product not found</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <>
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
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product Details</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Product Images */}
            <Animated.View
              style={[
                styles.imageSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setSelectedImageIndex(index);
                }}
              >
                {productImages.map((imageUrl, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                  </View>
                ))}
              </ScrollView>
              {productImages.length > 1 && (
                <View style={styles.imageIndicators}>
                  {productImages.map((_, index) => (
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
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            </Animated.View>

            {/* Product Info */}
            <Animated.View
              style={[
                styles.productInfo,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <LinearGradient colors={colors.cardGradient} style={styles.infoCard}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.ratingPriceContainer}>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {renderStars(product.rating)}
                    </View>
                    <Text style={styles.ratingText}>({product.rating})</Text>
                  </View>
                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                </View>
                <View style={styles.stockContainer}>
                  <Ionicons
                    name={product.inStock ? "checkmark-circle" : "close-circle"}
                    size={16}
                    color={product.inStock ? colors.success : colors.danger}
                  />
                  <Text style={[
                    styles.stockText,
                    { color: product.inStock ? colors.success : colors.danger }
                  ]}>
                    {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                  </Text>
                </View>
                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="remove" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.min(product.stockCount || 1, quantity + 1))}
                      style={styles.quantityButton}
                      disabled={quantity >= (product.stockCount || 1)}
                    >
                      <Ionicons name="add" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    onPress={() => setActiveTab('description')}
                    style={[styles.tab, activeTab === 'description' && styles.activeTab]}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'description' && styles.activeTabText
                    ]}>
                      Description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveTab('specifications')}
                    style={[styles.tab, activeTab === 'specifications' && styles.activeTab]}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'specifications' && styles.activeTabText
                    ]}>
                      Specifications
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Tab Content */}
                <View style={styles.tabContent}>
                  {activeTab === 'description' ? (
                    <View>
                      <Text style={styles.description}>
                        {showFullDescription ? product.fullDescription : product.description}
                      </Text>
                      {product.fullDescription && product.fullDescription !== product.description && (
                        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                          <Text style={styles.showMoreText}>
                            {showFullDescription ? 'Show Less' : 'Show More'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View style={styles.specificationsContainer}>
                      {product.specifications ? (
                        Object.entries(product.specifications).map(([key, value]) => (
                          <View key={key} style={styles.specificationRow}>
                            <Text style={styles.specKey}>{key}:</Text>
                            <Text style={styles.specValue}>{value}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noSpecsText}>No specifications available</Text>
                      )}
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          </ScrollView>
          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionButtons,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              onPress={handleAddToCart}
              style={[styles.actionButton, styles.addToCartButton]}
              disabled={!product.inStock}
            >
              <LinearGradient
                colors={product.inStock ? colors.buttonGradient : [colors.textLighter, colors.textLighter]}
                style={styles.buttonGradient}
              >
                <Ionicons name="cart" size={20} color="white" />
                <Text style={styles.buttonText}>Add to Cart</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBuyNow}
              style={[styles.actionButton, styles.buyNowButton]}
              disabled={!product.inStock}
            >
              <LinearGradient
                colors={product.inStock ? colors.accentGradient : [colors.textLighter, colors.textLighter]}
                style={styles.buttonGradient}
              >
                <Ionicons name="flash" size={20} color="white" />
                <Text style={styles.buttonText}>Buy Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
      <Cart visible={showCart} onClose={() => setShowCart(false)} />
    </>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingMd,
    backgroundColor: 'transparent',
  },
  headerButton: {
    padding: colors.spacingSm,
    borderRadius: colors.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: 'white',
  },
  imageSection: {
    position: 'relative',
    height: height * 0.4,
    backgroundColor: colors.backgroundCard,
    marginBottom: colors.spacingMd,
  },
  imageContainer: {
    width: width,
    height: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: colors.spacingMd,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textLighter,
    marginHorizontal: colors.spacingXs,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryBadge: {
    position: 'absolute',
    top: colors.spacingMd,
    left: colors.spacingMd,
    backgroundColor: colors.primary,
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    borderRadius: colors.borderRadius,
  },
  categoryText: {
    color: 'white',
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightSemiBold,
  },
  productInfo: {
    paddingHorizontal: colors.spacingMd,
    marginBottom: colors.spacingXxl,
  },
  infoCard: {
    borderRadius: colors.borderRadiusLarge,
    padding: colors.spacingLg,
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productName: {
    fontSize: colors.fontSizeXxxl,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginBottom: colors.spacingMd,
    lineHeight: 32,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: colors.spacingMd,
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
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
    fontWeight: colors.fontWeightMedium,
  },
  price: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightBold,
    color: colors.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingLg,
  },
  stockText: {
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightSemiBold,
    marginLeft: colors.spacingSm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: colors.spacingLg,
  },
  quantityLabel: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightSemiBold,
    color: colors.textColor,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundHover,
    borderRadius: colors.borderRadius,
    padding: colors.spacingXs,
  },
  quantityButton: {
    padding: colors.spacingSm,
    borderRadius: colors.spacingSm,
    backgroundColor: 'white',
  },
  quantityText: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightSemiBold,
    color: colors.textColor,
    marginHorizontal: colors.spacingMd,
    minWidth: 30,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundHover,
    borderRadius: colors.borderRadius,
    padding: colors.spacingXs,
    marginBottom: colors.spacingMd,
  },
  tab: {
    flex: 1,
    paddingVertical: colors.spacingSm,
    paddingHorizontal: colors.spacingMd,
    borderRadius: colors.spacingSm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightMedium,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  tabContent: {
    minHeight: 100,
  },
  description: {
    fontSize: colors.fontSizeMd,
    color: colors.textColor,
    lineHeight: 24,
    marginBottom: colors.spacingSm,
  },
  showMoreText: {
    fontSize: colors.fontSizeSm,
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  specificationsContainer: {
    gap: colors.spacingSm,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: colors.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  specKey: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
    fontWeight: colors.fontWeightMedium,
    flex: 1,
  },
  specValue: {
    fontSize: colors.fontSizeSm,
    color: colors.textColor,
    fontWeight: colors.fontWeightSemiBold,
    textAlign: 'right',
    flex: 1,
  },
  noSpecsText: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: colors.spacingMd,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: colors.borderRadiusLarge,
    overflow: 'hidden',
  },
  addToCartButton: {
    marginRight: colors.spacingSm,
  },
  buyNowButton: {
    marginLeft: colors.spacingSm,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: colors.spacingMd,
    paddingHorizontal: colors.spacingLg,
  },
  buttonText: {
    color: 'white',
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightBold,
    marginLeft: colors.spacingSm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: colors.spacingXl,
  },
  errorText: {
    fontSize: colors.fontSizeXl,
    color: 'white',
    fontWeight: colors.fontWeightBold,
    marginTop: colors.spacingMd,
    marginBottom: colors.spacingLg,
  },
  backButton: {
    backgroundColor: 'white',
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightSemiBold,
  },
});

export default ProductDetail;
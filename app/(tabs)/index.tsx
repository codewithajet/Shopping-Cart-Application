import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../components/CartContext';
import Cart from '../../components/Cart';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ProductList from '../../components/ProductList';

// Define interfaces for our data types
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

// Sample product data (should match ProductDetail and context)
const productsData: Product[] = [
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

const Index: React.FC = () => {
  const router = useRouter();
  const { items: cart, addToCart, removeFromCart } = useCart();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: { min: 0, max: 2000 },
    sortBy: 'name'
  });

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let result = productsData.filter(product => {
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
  // Calculate total price
  const cartTotal: number = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
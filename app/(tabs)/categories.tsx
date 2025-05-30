import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

// Enhanced color scheme matching your existing design
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
};

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
  description: string;
  gradient: [string, string];
  icon: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  productCount: number;
  image: string;
}

const CategoriesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const scrollY = useSharedValue(0);

  // Sample categories data - memoized to prevent re-creation on every render
  const categories = useMemo<Category[]>(() => [
    {
      id: 1,
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      productCount: 245,
      description: 'Latest gadgets and tech accessories',
      gradient: ['#667eea', '#764ba2'],
      icon: '📱',
    },
    {
      id: 2,
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      productCount: 189,
      description: 'Trendy clothing and accessories',
      gradient: ['#f093fb', '#f5576c'],
      icon: '👗',
    },
    {
      id: 3,
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      productCount: 167,
      description: 'Beautiful items for your home',
      gradient: ['#43e97b', '#38f9d7'],
      icon: '🏠',
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      productCount: 123,
      description: 'Equipment for active lifestyle',
      gradient: ['#4facfe', '#00f2fe'],
      icon: '⚽',
    },
    {
      id: 5,
      name: 'Books & Media',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      productCount: 89,
      description: 'Knowledge and entertainment',
      gradient: ['#a8edea', '#fed6e3'],
      icon: '📚',
    },
    {
      id: 6,
      name: 'Beauty & Health',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      productCount: 156,
      description: 'Care for your wellbeing',
      gradient: ['#ffecd2', '#fcb69f'],
      icon: '💄',
    },
  ], []);

  // Sample subcategories - memoized to prevent re-creation on every render
  const subCategories = useMemo<SubCategory[]>(() => [
    { id: 1, name: 'Smartphones', categoryId: 1, productCount: 45, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
    { id: 2, name: 'Laptops', categoryId: 1, productCount: 32, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { id: 3, name: 'Headphones', categoryId: 1, productCount: 28, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { id: 4, name: 'Cameras', categoryId: 1, productCount: 19, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop' },
  ], []);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Get subcategories for selected category
  const selectedSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subCategories.filter(sub => sub.categoryId === selectedCategory);
  }, [selectedCategory, subCategories]);

  // Animated header style
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.9]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -10]);
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const renderCategoryCard = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.categoryCard}
    >
      <Pressable
        onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
        style={({ pressed }) => [
          styles.categoryPressable,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryImageContainer}>
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.categoryImageOverlay}
              />
            </View>
            
            <BlurView intensity={20} style={styles.categoryInfo}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <View style={styles.categoryTextContainer}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryCount}>{item.productCount} items</Text>
                </View>
              </View>
              <Text style={styles.categoryDescription}>{item.description}</Text>
            </BlurView>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  const renderSubCategoryCard = ({ item, index }: { item: SubCategory; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      style={styles.subCategoryCard}
    >
      <Pressable
        style={({ pressed }) => [
          styles.subCategoryPressable,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.subCategoryImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.subCategoryOverlay}
        >
          <Text style={styles.subCategoryName}>{item.name}</Text>
          <Text style={styles.subCategoryCount}>{item.productCount}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        
        {/* Animated Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.headerContent}>
            <Text style={styles.headerTitle}>Categories</Text>
            <Text style={styles.headerSubtitle}>Discover amazing products</Text>
          </Animated.View>
          
          {/* Search Bar */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.searchContainer}>
            <BlurView intensity={20} style={styles.searchBlur}>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search categories..."
                  placeholderTextColor={colors.textLighter}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </BlurView>
          </Animated.View>
        </Animated.View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Categories Grid */}
          <View style={styles.categoriesContainer}>
            <FlatList
              data={filteredCategories}
              renderItem={renderCategoryCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.categoriesGrid}
              columnWrapperStyle={styles.categoryRow}
            />
          </View>

          {/* Subcategories */}
          {selectedCategory && selectedSubCategories.length > 0 && (
            <Animated.View
              entering={FadeInUp.springify()}
              style={styles.subCategoriesContainer}
            >
              <Text style={styles.subCategoriesTitle}>Explore More</Text>
              <FlatList
                data={selectedSubCategories}
                renderItem={renderSubCategoryCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subCategoriesList}
              />
            </Animated.View>
          )}

          {/* Featured Section */}
          <Animated.View
            entering={FadeInUp.delay(600)}
            style={styles.featuredSection}
          >
            <LinearGradient
              colors={colors.accentGradient}
              style={styles.featuredCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>🔥 Hot Deals</Text>
                <Text style={styles.featuredSubtitle}>
                  Up to 50% off on selected items
                </Text>
                <Pressable style={styles.featuredButton}>
                  <Text style={styles.featuredButtonText}>Shop Now</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    marginHorizontal: 10,
  },
  searchBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoriesGrid: {
    gap: 15,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  categoryPressable: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryGradient: {
    height: 180,
  },
  categoryContent: {
    flex: 1,
    position: 'relative',
  },
  categoryImageContainer: {
    flex: 1,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  categoryInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  subCategoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subCategoriesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
  },
  subCategoriesList: {
    paddingRight: 20,
  },
  subCategoryCard: {
    marginRight: 15,
  },
  subCategoryPressable: {
    width: 120,
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  subCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  subCategoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: '60%',
    justifyContent: 'flex-end',
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  subCategoryCount: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredCard: {
    borderRadius: 20,
    padding: 25,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuredButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuredButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CategoriesScreen;
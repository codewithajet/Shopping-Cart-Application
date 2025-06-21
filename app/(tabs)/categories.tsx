import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../constants/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Category, fetchCategories } from '../../data/categories';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const CategoriesScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useAppTheme();
  const palette = Colors[theme];
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const scrollY = useSharedValue(0);
  const searchFocused = useSharedValue(0);

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategoriesData(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = useMemo(() => {
    return categoriesData.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categoriesData]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.95]);
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.98]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(searchFocused.value ? 1.02 : 1);
    return {
      transform: [{ scale }],
    };
  });

  const handleCategoryPress = (categoryId: number) => {
    router.push({ pathname: '/ProductsScreen', params: { category_id: categoryId } });
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    searchFocused.value = withTiming(1);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    searchFocused.value = withTiming(0);
  };

  const renderCategoryCard = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      style={[styles.categoryCard, { width: CARD_WIDTH }]}
    >
      <Pressable
        onPress={() => handleCategoryPress(item.id)}
        style={({ pressed }) => [
          styles.categoryPressable,
          {
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
      >
        <View style={[
          styles.categoryContainer,
          {
            backgroundColor: palette.card,
            shadowColor: palette.shadow,
          }
        ]}>
          {/* Image Section */}
          <View style={styles.categoryImageContainer}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <LinearGradient 
              colors={isDark 
                ? ['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)'] 
                : ['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']} 
              style={styles.categoryImageOverlay} 
            />
            
            {/* Floating Icon */}
            <View style={[
              styles.categoryIconContainer,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)' }
            ]}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
            </View>

            {/* Product Count Badge */}
            <View style={[
              styles.productCountBadge,
              { backgroundColor: palette.tint }
            ]}>
              <Text style={styles.productCountText}>{item.productCount}</Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.categoryContent}>
            <Text style={[
              styles.categoryName,
              { color: palette.text }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.categoryDescription,
              { color: palette.icon }
            ]} numberOfLines={2}>
              {item.description}
            </Text>
            
            {/* Action Arrow */}
            <View style={styles.categoryAction}>
              <Ionicons 
                name="arrow-forward" 
                size={16} 
                color={palette.tint}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      entering={FadeInUp.delay(300)} 
      style={styles.emptyState}
    >
      <Ionicons 
        name="search-outline" 
        size={64} 
        color={palette.icon} 
      />
      <Text style={[
        styles.emptyStateTitle,
        { color: palette.text }
      ]}>
        No categories found
      </Text>
      <Text style={[
        styles.emptyStateSubtitle,
        { color: palette.icon }
      ]}>
        Try adjusting your search terms
      </Text>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={isDark ? palette.background : palette.background}
        translucent={false}
      />
      
      {/* Background Gradient */}
      <LinearGradient 
        colors={palette.cardGradient as [string, string]} 
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Animated Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: palette.tint }]}>Categories</Text>
            <Text style={[styles.headerSubtitle, { color: palette.accent }]}>Discover amazing products</Text>
          </Animated.View>

          {/* Enhanced Search Bar */}
          <Animated.View 
            entering={FadeInUp.delay(400)} 
            style={[styles.searchContainer, searchAnimatedStyle]}
          >
            <BlurView 
              intensity={isDark ? 30 : 20} 
              tint={isDark ? 'dark' : 'light'}
              style={[
                styles.searchBlur,
                {
                  backgroundColor: isDark ? palette.overlay : 'rgba(255,255,255,0.8)',
                  borderWidth: isSearchFocused ? 2 : 1,
                  borderColor: isSearchFocused ? palette.tint : 'rgba(255,255,255,0.3)',
                }
              ]}
            >
              <View style={styles.searchInputContainer}>
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={palette.icon} 
                  style={styles.searchIconStyle}
                />
                <TextInput
                  style={[
                    styles.searchInput,
                    { color: palette.text }
                  ]}
                  placeholder="Search categories..."
                  placeholderTextColor={palette.icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')}
                    style={styles.clearButton}
                  >
                    <Ionicons 
                      name="close-circle" 
                      size={20} 
                      color={palette.icon} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </Animated.View>
        </Animated.View>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.tint} />
            <Text style={[
              styles.loadingText,
              { color: palette.icon }
            ]}>
              Loading categories...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.categoriesGrid}
            columnWrapperStyle={styles.categoryRow}
            ListFooterComponent={<View style={styles.bottomSpacing} />}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            onScroll={(event) => {
              scrollY.value = event.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={6}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
  },
  searchContainer: {
    marginHorizontal: 10,
  },
  searchBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIconStyle: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoriesGrid: {
    padding: 20,
    paddingTop: 10,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    marginHorizontal: 5,
    marginBottom: 20,
  },
  categoryPressable: {
    borderRadius: 20,
  },
  categoryContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  categoryImageContainer: {
    height: 140,
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
    height: '70%',
  },
  categoryIconContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
  },
  productCountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
  },
  productCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryContent: {
    padding: 16,
    minHeight: 90,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  categoryDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    flex: 1,
  },
  categoryAction: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default CategoriesScreen;
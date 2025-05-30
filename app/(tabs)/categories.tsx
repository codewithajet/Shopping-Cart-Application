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
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { categoriesData } from '../data/categories';

const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  secondary: '#f093fb',
  accent: '#43e97b',
  textColor: '#2d3748',
  textLight: '#718096',
  textLighter: '#a0aec0',
  backgroundMain: '#f7fafc',
  backgroundCard: '#ffffff',
  backgroundGradient: ['#667eea', '#764ba2'] as [string, string],
  shadowColor: 'rgba(0, 0, 0, 0.1)',
};

const CategoriesScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const scrollY = useSharedValue(0);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categoriesData.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Animated header style
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.9]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -10]);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Navigate to product list filtered by category
  const handleCategoryPress = (categoryName: string) => {
    router.push({ pathname: '/', params: { category: categoryName } });
  };

  const renderCategoryCard = ({ item, index }: { item: typeof categoriesData[0]; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.categoryCard}
    >
      <Pressable
        onPress={() => handleCategoryPress(item.name)}
        style={({ pressed }) => [
          styles.categoryPressable,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
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
                  <Text style={styles.categoryCount}>{item.productCount}</Text>
                </View>
              </View>
              <Text style={styles.categoryDescription}>{item.description}</Text>
            </BlurView>
          </View>
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

        {/* Categories Grid */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
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
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerContent: { alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' },
  searchContainer: { marginHorizontal: 10 },
  searchBlur: { borderRadius: 20, overflow: 'hidden' },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  searchIcon: { fontSize: 18, marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: colors.textColor },
  content: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  categoriesContainer: { padding: 20 },
  categoriesGrid: { gap: 15 },
  categoryRow: { justifyContent: 'space-between' },
  categoryCard: { flex: 1, marginHorizontal: 5, marginBottom: 15 },
  categoryPressable: { borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: colors.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  categoryGradient: { height: 180 },
  categoryContent: { flex: 1, position: 'relative' },
  categoryImageContainer: { flex: 1, position: 'relative' },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryImageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  categoryInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  categoryIcon: { fontSize: 24, marginRight: 10 },
  categoryTextContainer: { flex: 1 },
  categoryName: { fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 2 },
  categoryCount: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)' },
  categoryDescription: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 16 },
  bottomSpacing: { height: 20 },
});

export default CategoriesScreen;
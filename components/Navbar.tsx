import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getApiBaseUrl } from '../config/apiConfig';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#667eea',
  primaryLight: '#764ba2',
  secondary: '#f093fb',
  accent: '#43e97b',
  textColor: '#2d3748',
  textDark: '#1a202c',
  textLight: '#718096',
  textLighter: '#a0aec0',
  backgroundCard: '#ffffff',
  backgroundHover: '#edf2f7',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
  secondaryGradient: ['#f093fb', '#f5576c'] as [string, string],
  borderRadius: 12,
  borderRadiusLarge: 20,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

const categoryIcons: { [key: string]: any } = {
  'All': 'apps-outline',
  'Electronics': 'phone-portrait-outline',
  'Fashion': 'shirt-outline',
  'Home': 'home-outline',
  'Books': 'book-outline',
  'Sports': 'fitness-outline',
};

const sortOptions = [
  { value: 'name' as const, label: 'Name A-Z', icon: 'text-outline' as any },
  { value: 'price-low' as const, label: 'Price: Low to High', icon: 'arrow-up-outline' as any },
  { value: 'price-high' as const, label: 'Price: High to Low', icon: 'arrow-down-outline' as any },
  { value: 'rating' as const, label: 'Rating', icon: 'star-outline' as any },
];

const priceRanges = [
  { min: 0, max: 50, label: 'Under $50', icon: 'cash-outline' as any },
  { min: 50, max: 100, label: '$50 - $100', icon: 'card-outline' as any },
  { min: 100, max: 500, label: '$100 - $500', icon: 'wallet-outline' as any },
  { min: 500, max: 1000, label: '$500 - $1000', icon: 'diamond-outline' as any },
  { min: 1000, max: 2000, label: 'Over $1000', icon: 'trophy-outline' as any },
  { min: 0, max: 2000, label: 'All Prices', icon: 'infinite-outline' as any },
];

interface FilterOptions {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating';
}

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

type CategoryType = {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  productCount?: number;
};

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(`${getApiBaseUrl()}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        let categoriesList: CategoryType[] = [];
        if (Array.isArray(data)) {
          categoriesList = data;
        } else if (Array.isArray(data.data)) {
          categoriesList = data.data;
        }
        setCategories([{ id: 'all', name: 'All' }, ...categoriesList]);
      } catch (error) {
        setCategories([{ id: 'all', name: 'All' }]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // MAIN: Fetch products for category filter (calls parent onFiltersChange)
  const handleCategoryPress = async (categoryName: string) => {
    // If "All", just update filters and let parent fetch all products
    if (categoryName === 'All') {
      onFiltersChange({ ...filters, category: 'All' });
      return;
    }

    // Fetch products for this category if you want server-side filtering:
    // e.g., GET /products?category=categoryName
    // But here, just update the filter and let parent handle fetch/filter logic.
    onFiltersChange({ ...filters, category: categoryName });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilters(false);
  };
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      category: 'All',
      priceRange: { min: 0, max: 2000 },
      sortBy: 'name'
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setShowFilters(false);
  };
  const hasActiveFilters = () => {
    return filters.category !== 'All' ||
      filters.priceRange.min !== 0 ||
      filters.priceRange.max !== 2000 ||
      filters.sortBy !== 'name';
  };

  return (
    <>
      {/* Main Navbar */}
      <LinearGradient
        colors={colors.buttonGradient}
        style={styles.navbar}
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <LinearGradient
            colors={searchFocused ? colors.accentGradient : ['#f8fafc', '#e2e8f0']}
            style={styles.searchGradient}
          >
            <Ionicons
              name="search"
              size={20}
              color={searchFocused ? colors.textDark : colors.textLight}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, searchFocused && styles.searchInputFocused]}
              placeholder="Search products..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Ionicons name="close-circle" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButtonContainer}
          onPress={() => setShowFilters(true)}
        >
          <LinearGradient
            colors={hasActiveFilters() ? colors.secondaryGradient : colors.buttonGradient}
            style={styles.filterButton}
          >
            <Ionicons
              name="options"
              size={20}
              color="white"
            />
            {hasActiveFilters() && (
              <View style={styles.filterIndicator}>
                <LinearGradient
                  colors={colors.accentGradient}
                  style={styles.filterIndicatorGradient}
                />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Category Chip Scroll */}
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.95)']}
        style={styles.categorySection}
      >
        {loadingCategories ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ margin: 12 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id ?? index}
                style={styles.categoryChipContainer}
                onPress={() => handleCategoryPress(category.name)}
              >
                <LinearGradient
                  colors={filters.category === category.name ? colors.buttonGradient : ['#ffffff', '#f1f5f9']}
                  style={[
                    styles.categoryChip,
                    filters.category === category.name && styles.categoryChipActive,
                  ]}
                >
                  <Ionicons
                    name={categoryIcons[category.name] || 'cube-outline'}
                    size={16}
                    color={filters.category === category.name ? 'white' : colors.primary}
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      filters.category === category.name && styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </LinearGradient>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={colors.buttonGradient}
              style={styles.modalContent}
            >
              {/* Modal Header */}
              <LinearGradient
                colors={colors.buttonGradient}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>Filters & Sorting</Text>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </LinearGradient>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.modalBodyContent}
              >
                {/* Sort By Section */}
                <View style={styles.filterSection}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="swap-vertical-outline" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Sort By</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {sortOptions.map((option, idx) => (
                      <TouchableOpacity
                        key={`${option.value}-${idx}`}
                        style={styles.optionRow}
                        onPress={() =>
                          setTempFilters({ ...tempFilters, sortBy: option.value as FilterOptions['sortBy'] })
                        }
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.optionContent,
                          tempFilters.sortBy === option.value && styles.optionContentActive
                        ]}>
                          <View style={styles.optionLeft}>
                            <Ionicons
                              name={option.icon}
                              size={20}
                              color={tempFilters.sortBy === option.value ? 'white' : colors.primary}
                              style={styles.optionIcon}
                            />
                            <Text style={[
                              styles.optionText,
                              tempFilters.sortBy === option.value && styles.optionTextActive
                            ]}>
                              {option.label}
                            </Text>
                          </View>
                          <Ionicons
                            name={tempFilters.sortBy === option.value ? "checkmark-circle" : "ellipse-outline"}
                            size={24}
                            color={tempFilters.sortBy === option.value ? 'white' : colors.textLight}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Category Section */}
                <View style={styles.filterSection}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="grid-outline" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Category</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {categories.map((category, idx) => (
                      <TouchableOpacity
                        key={category.id ?? idx}
                        style={styles.optionRow}
                        onPress={() => setTempFilters({ ...tempFilters, category: category.name })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.optionContent,
                          tempFilters.category === category.name && styles.optionContentActive
                        ]}>
                          <View style={styles.optionLeft}>
                            <Ionicons
                              name={categoryIcons[category.name] || 'cube-outline'}
                              size={20}
                              color={tempFilters.category === category.name ? 'white' : colors.primary}
                              style={styles.optionIcon}
                            />
                            <Text style={[
                              styles.optionText,
                              tempFilters.category === category.name && styles.optionTextActive
                            ]}>
                              {category.name}
                            </Text>
                          </View>
                          <Ionicons
                            name={tempFilters.category === category.name ? "checkmark-circle" : "ellipse-outline"}
                            size={24}
                            color={tempFilters.category === category.name ? 'white' : colors.textLight}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Price Range Section */}
                <View style={styles.filterSection}>
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Price Range</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {priceRanges.map((range, idx) => (
                      <TouchableOpacity
                        key={`${range.min}-${range.max}-${idx}`}
                        style={styles.optionRow}
                        onPress={() => setTempFilters({
                          ...tempFilters,
                          priceRange: { min: range.min, max: range.max }
                        })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.optionContent,
                          tempFilters.priceRange.min === range.min &&
                          tempFilters.priceRange.max === range.max &&
                          styles.optionContentActive
                        ]}>
                          <View style={styles.optionLeft}>
                            <Ionicons
                              name={range.icon}
                              size={20}
                              color={
                                tempFilters.priceRange.min === range.min &&
                                tempFilters.priceRange.max === range.max
                                  ? 'white'
                                  : colors.primary
                              }
                              style={styles.optionIcon}
                            />
                            <Text style={[
                              styles.optionText,
                              tempFilters.priceRange.min === range.min &&
                                tempFilters.priceRange.max === range.max &&
                                styles.optionTextActive
                            ]}>
                              {range.label}
                            </Text>
                          </View>
                          <Ionicons
                            name={
                              tempFilters.priceRange.min === range.min &&
                              tempFilters.priceRange.max === range.max
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={24}
                            color={
                              tempFilters.priceRange.min === range.min &&
                              tempFilters.priceRange.max === range.max
                                ? 'white'
                                : colors.textLight
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.resetButtonContainer} onPress={resetFilters}>
                  <View style={styles.resetButton}>
                    <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                    <Text style={styles.resetButtonText}>Reset</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyButtonContainer} onPress={applyFilters}>
                  <LinearGradient
                    colors={colors.accentGradient}
                    style={styles.applyButton}
                  >
                    <Ionicons name="checkmark-outline" size={18} color="white" />
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // ... [same as your styles definition above]
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingMd,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  searchContainer: {
    flex: 1,
    marginRight: colors.spacingMd,
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
  },
  searchContainerFocused: {
    transform: [{ scale: 1.02 }],
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    borderRadius: colors.borderRadius,
  },
  searchIcon: {
    marginRight: colors.spacingSm,
  },
  searchInput: {
    flex: 1,
    fontSize: colors.fontSizeMd,
    color: colors.textDark,
    fontWeight: colors.fontWeightMedium,
  },
  searchInputFocused: {
    color: colors.textDark,
  },
  filterButtonContainer: {
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButton: {
    padding: colors.spacingMd,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  filterIndicatorGradient: {
    flex: 1,
    borderRadius: 6,
  },
  categorySection: {
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    alignItems: 'center',
  },
  categoryChipContainer: {
    marginRight: colors.spacingSm,
    borderRadius: colors.borderRadiusLarge,
    overflow: 'hidden',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    borderRadius: colors.borderRadiusLarge,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryChipActive: {
    elevation: 6,
    shadowOpacity: 0.2,
  },
  categoryIcon: {
    marginRight: colors.spacingXs,
  },
  categoryChipText: {
    fontSize: colors.fontSizeSm,
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: colors.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: colors.borderRadiusLarge,
    borderTopRightRadius: colors.borderRadiusLarge,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingLg,
  },
  modalTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: 'white',
  },
  closeButton: {
    padding: colors.spacingXs,
    borderRadius: colors.borderRadius,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    paddingHorizontal: colors.spacingLg,
    paddingTop: colors.spacingLg,
    paddingBottom: colors.spacingXl,
  },
  filterSection: {
    marginBottom: colors.spacingXl,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: colors.borderRadius,
    padding: colors.spacingMd,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingMd,
    paddingBottom: colors.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  sectionTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.textDark,
    marginLeft: colors.spacingSm,
  },
  optionsContainer: {
    gap: colors.spacingSm,
  },
  optionRow: {
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  optionContentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: colors.spacingMd,
  },
  optionText: {
    fontSize: colors.fontSizeMd,
    color: colors.textDark,
    fontWeight: colors.fontWeightMedium,
    flex: 1,
  },
  optionTextActive: {
    color: 'white',
    fontWeight: colors.fontWeightBold,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: colors.spacingLg,
    paddingVertical: colors.spacingLg,
    backgroundColor: 'rgba(248,250,252,0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  resetButtonContainer: {
    flex: 1,
    marginRight: colors.spacingSm,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'white',
  },
  resetButtonText: {
    color: colors.primary,
    fontWeight: colors.fontWeightBold,
    fontSize: colors.fontSizeMd,
    marginLeft: colors.spacingXs,
  },
  applyButtonContainer: {
    flex: 1,
    marginLeft: colors.spacingSm,
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: colors.spacingMd,
    borderRadius: colors.borderRadius,
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: colors.fontWeightBold,
    fontSize: colors.fontSizeMd,
    marginLeft: colors.spacingXs,
  },
});

export default Navbar;
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../data/categories';
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const { height } = Dimensions.get('window');

export interface FilterOptions {
  category_id: number | null;
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
  categories: Category[];
  forcedTheme?: 'light' | 'dark';
}

const sortOptions = [
  { value: 'name' as const, label: 'Name A-Z', icon: 'text-outline' as const },
  { value: 'price-low' as const, label: 'Price: Low to High', icon: 'trending-up-outline' as const },
  { value: 'price-high' as const, label: 'Price: High to Low', icon: 'trending-down-outline' as const },
  { value: 'rating' as const, label: 'Rating', icon: 'star-outline' as const },
];

const categoryIcons: { [key: string]: any } = {
  'All': 'apps-outline',
  'Electronics': 'phone-portrait-outline',
  'Fashion': 'shirt-outline',
  'Home': 'home-outline',
  'Books': 'book-outline',
  'Sports': 'fitness-outline',
};

const commonColors = {
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

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  categories,
  forcedTheme,
}) => {
  const { theme: systemTheme } = useAppTheme();
  const theme: 'light' | 'dark' = forcedTheme || systemTheme;
  const palette = Colors[theme];

  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // Add "All" pseudo-category
  const displayCategories = [{ id: null, name: "All", image: "", description: "", productCount: 0 }, ...(categories ?? [])];

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleCategoryPress = (categoryId: number | null) => {
    onFiltersChange({
      ...filters,
      category_id: categoryId,
    });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      category_id: null,
      priceRange: { min: 0, max: 2000 },
      sortBy: 'name'
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setShowFilters(false);
  };

  const hasActiveFilters = () =>
    filters.category_id !== null ||
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 2000 ||
    filters.sortBy !== 'name';

  return (
    <>
      <LinearGradient colors={palette.cardGradient} style={styles.navbar}>
        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <LinearGradient
            colors={searchFocused ? [palette.overlay, palette.card] : [palette.card, palette.overlay]}
            style={styles.searchGradient}
          >
            <Ionicons
              name="search"
              size={20}
              color={searchFocused ? palette.primary : palette.icon}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, searchFocused && styles.searchInputFocused, { color: palette.text }]}
              placeholder="Search products..."
              placeholderTextColor={palette.icon}
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Ionicons name="close-circle" size={20} color={palette.icon} />
              </TouchableOpacity>
            )}
          </LinearGradient>
          <TouchableOpacity
            style={styles.filterButtonContainer}
            onPress={() => setShowFilters(true)}
          >
          <LinearGradient
            colors={hasActiveFilters() ? [palette.accent, palette.tint] : [palette.card, palette.card]}
            style={styles.filterButton}
          >
            <Ionicons
              name="options"
              size={20}
              color={palette.text}
            />
          </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <LinearGradient colors={palette.cardGradient} style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {displayCategories.map((category) => (
            <TouchableOpacity
              key={category.id ?? "all"}
              style={styles.categoryChipContainer}
              onPress={() => handleCategoryPress(category.id)}
            >
              <LinearGradient
                colors={
                  filters.category_id === category.id || (filters.category_id === null && category.id === null)
                    ? [palette.primary, palette.secondary]
                    : [palette.card, palette.overlay]
                }
                style={[
                  styles.categoryChip,
                  filters.category_id === category.id && styles.categoryChipActive,
                ]}
              >
                <Ionicons
                  name={categoryIcons[category.name] || 'cube-outline'}
                  size={18}
                  color={filters.category_id === category.id ? palette.text : palette.icon}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    (filters.category_id === category.id || (filters.category_id === null && category.id === null)) &&
                      styles.categoryChipTextActive,
                    { color: filters.category_id === category.id ? palette.text : palette.icon },
                  ]}
                >
                  {category.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: palette.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: palette.card }]}>
            <LinearGradient
              colors={palette.cardGradient}
              style={styles.modalContent}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: palette.text }]}>Filters & Sorting</Text>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color={palette.tint} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.modalBodyContent}
              >
                {/* Sort By Section */}
                <View style={[styles.filterSection, { backgroundColor: palette.overlay }]}>
                  <Text style={[styles.sectionTitle, { color: palette.text }]}>Sort By</Text>
                  <View style={styles.optionsContainer}>
                    {sortOptions.map((option, idx) => (
                      <TouchableOpacity
                        key={`${option.value}-${idx}`}
                        style={styles.optionRow}
                        onPress={() =>
                          setTempFilters({ ...tempFilters, sortBy: option.value })
                        }
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.optionContent,
                          tempFilters.sortBy === option.value && [styles.optionContentActive, { backgroundColor: palette.primary, borderColor: palette.primary }]
                        ]}>
                          <Ionicons
                            name={option.icon}
                            size={17}
                            color={tempFilters.sortBy === option.value ? palette.textLight : palette.text}
                            style={styles.optionIcon}
                          />
                          <Text style={[
                            styles.optionText,
                            tempFilters.sortBy === option.value && styles.optionTextActive,
                            { color: tempFilters.sortBy === option.value ? palette.textLight : palette.text }
                          ]}>
                            {option.label}
                          </Text>
                          <Ionicons
                            name={tempFilters.sortBy === option.value ? "checkmark-circle" : "ellipse-outline"}
                            size={19}
                            color={tempFilters.sortBy === option.value ? palette.textLight : palette.icon}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Price Range Section */}
                <View style={[styles.filterSection, { backgroundColor: palette.overlay }]}>
                  <Text style={[styles.sectionTitle, { color: palette.text }]}>Price Range</Text>
                  <View style={styles.priceInputContainer}>
                    <View style={[styles.priceInputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                      <Text style={[styles.priceLabel, { color: palette.icon }]}>Min</Text>
                      <TextInput
                        style={[styles.priceInput, { color: palette.text }]}
                        value={tempFilters.priceRange.min.toString()}
                        onChangeText={(text) => {
                          const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                          setTempFilters({
                            ...tempFilters,
                            priceRange: { ...tempFilters.priceRange, min: value }
                          });
                        }}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={palette.icon}
                      />
                    </View>
                    <Text style={[styles.priceSeparator, { color: palette.icon }]}>to</Text>
                    <View style={[styles.priceInputWrapper, { backgroundColor: palette.card, borderColor: palette.border }]}>
                      <Text style={[styles.priceLabel, { color: palette.icon }]}>Max</Text>
                      <TextInput
                        style={[styles.priceInput, { color: palette.text }]}
                        value={tempFilters.priceRange.max.toString()}
                        onChangeText={(text) => {
                          const value = parseInt(text.replace(/[^0-9]/g, '')) || 2000;
                          setTempFilters({
                            ...tempFilters,
                            priceRange: { ...tempFilters.priceRange, max: value }
                          });
                        }}
                        keyboardType="numeric"
                        placeholder="2000"
                        placeholderTextColor={palette.icon}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={[styles.modalFooter, { backgroundColor: palette.overlay, borderTopColor: palette.border }]}>
                <TouchableOpacity style={styles.resetButtonContainer} onPress={resetFilters}>
                  <View style={[styles.resetButton, { borderColor: palette.primary, backgroundColor: palette.card }]}>
                    <Ionicons name="refresh-outline" size={17} color={palette.primary} />
                    <Text style={[styles.resetButtonText, { color: palette.primary }]}>Reset</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButtonContainer} onPress={applyFilters}>
                  <LinearGradient
                    colors={[palette.primary, palette.secondary]}
                    style={styles.applyButton}
                  >
                    <Ionicons name="checkmark-outline" size={17} color={palette.textLight} />
                    <Text style={[styles.applyButtonText, { color: palette.textLight }]}>Apply</Text>
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
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingMd,
    paddingVertical: commonColors.spacingMd,
    elevation: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flex: 1,
    marginRight: commonColors.spacingMd,
    borderRadius: commonColors.borderRadius,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainerFocused: {
    transform: [{ scale: 1.01 }],
  },
  searchGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingMd,
    paddingVertical: commonColors.spacingSm,
    borderRadius: commonColors.borderRadius,
  },
  searchIcon: {
    marginRight: commonColors.spacingSm,
  },
  searchInput: {
    flex: 1,
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  searchInputFocused: {},
  filterButtonContainer: {
    borderRadius: commonColors.borderRadius,
    overflow: 'hidden',
    marginLeft: commonColors.spacingSm,
  },
  filterButton: {
    padding: commonColors.spacingMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    elevation: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  categoryScroll: {
    maxHeight: 55,
  },
  categoryContainer: {
    paddingHorizontal: commonColors.spacingMd,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: commonColors.spacingSm,
  },
  categoryChipContainer: {
    marginRight: commonColors.spacingSm,
    borderRadius: commonColors.borderRadiusLarge,
    overflow: 'hidden',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingMd,
    paddingVertical: commonColors.spacingSm,
    borderRadius: commonColors.borderRadiusLarge,
    elevation: 1,
  },
  categoryChipActive: {
    elevation: 3,
  },
  categoryIcon: {
    marginRight: commonColors.spacingXs,
  },
  categoryChipText: {
    fontSize: commonColors.fontSizeSm,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  categoryChipTextActive: {
    fontWeight: commonColors.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: height * 0.6,
    minHeight: height * 0.4,
    justifyContent: 'flex-end',
    borderTopLeftRadius: commonColors.borderRadiusLarge,
    borderTopRightRadius: commonColors.borderRadiusLarge,
    overflow: 'hidden',
  },
  modalContent: {
    borderTopLeftRadius: commonColors.borderRadiusLarge,
    borderTopRightRadius: commonColors.borderRadiusLarge,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingLg,
    paddingVertical: commonColors.spacingMd,
    backgroundColor: 'transparent',
  },
  modalTitle: {
    fontSize: commonColors.fontSizeLg,
    fontWeight: commonColors.fontWeightBold,
  },
  closeButton: {
    padding: commonColors.spacingXs,
    borderRadius: commonColors.borderRadius,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    paddingHorizontal: commonColors.spacingLg,
    paddingTop: commonColors.spacingMd,
    paddingBottom: commonColors.spacingXl,
  },
  filterSection: {
    marginBottom: commonColors.spacingLg,
    borderRadius: commonColors.borderRadius,
    padding: commonColors.spacingMd,
  },
  sectionTitle: {
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightBold,
    marginBottom: commonColors.spacingSm,
  },
  optionsContainer: {
    gap: commonColors.spacingXs,
  },
  optionRow: {
    borderRadius: commonColors.borderRadius,
    overflow: 'hidden',
    marginBottom: commonColors.spacingXs,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingMd,
    paddingVertical: commonColors.spacingSm,
    borderRadius: commonColors.borderRadius,
    borderWidth: 1,
    flex: 1,
  },
  optionContentActive: {},
  optionIcon: {
    marginRight: commonColors.spacingSm,
  },
  optionText: {
    flex: 1,
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  optionTextActive: {},
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: commonColors.spacingSm,
    marginBottom: commonColors.spacingSm,
    gap: commonColors.spacingSm,
  },
  priceInputWrapper: {
    flex: 1,
    borderRadius: commonColors.borderRadius,
    paddingHorizontal: commonColors.spacingSm,
    paddingVertical: commonColors.spacingXs,
    borderWidth: 1,
  },
  priceLabel: {
    fontSize: commonColors.fontSizeSm,
    fontWeight: commonColors.fontWeightSemiBold,
    marginBottom: commonColors.spacingXs,
  },
  priceInput: {
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightSemiBold,
    padding: 0,
    minHeight: 22,
    textAlign: 'center',
  },
  priceSeparator: {
    marginHorizontal: commonColors.spacingSm,
    fontSize: commonColors.fontSizeMd,
    fontWeight: commonColors.fontWeightSemiBold,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: commonColors.spacingLg,
    paddingVertical: commonColors.spacingMd,
    gap: commonColors.spacingMd,
    borderTopWidth: 1,
  },
  resetButtonContainer: {
    flex: 1,
    marginRight: commonColors.spacingSm,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: commonColors.spacingSm,
    borderRadius: commonColors.borderRadius,
    borderWidth: 2,
  },
  resetButtonText: {
    fontWeight: commonColors.fontWeightBold,
    fontSize: commonColors.fontSizeMd,
    marginLeft: commonColors.spacingXs,
  },
  applyButtonContainer: {
    flex: 1,
    marginLeft: commonColors.spacingSm,
    borderRadius: commonColors.borderRadius,
    overflow: 'hidden',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: commonColors.spacingSm,
    borderRadius: commonColors.borderRadius,
    elevation: 3,
  },
  applyButtonText: {
    fontWeight: commonColors.fontWeightBold,
    fontSize: commonColors.fontSizeMd,
    marginLeft: commonColors.spacingXs,
  },
});

export default Navbar;
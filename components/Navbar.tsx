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
import { Category } from '../data/categories';

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
}

const colors = {
  primary: '#667eea',
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  accentGradient: ['#43e97b', '#38f9d7'] as [string, string],
  borderRadius: 12,
  borderRadiusLarge: 20,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  textLight: '#718096',
  textDark: '#1a202c',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
};

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  categories,
}) => {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  // Add "All" pseudo-category
  const displayCategories = [{ id: null, name: "All", image: "", description: "", productCount: 0 }, ...categories];

  const handleCategoryPress = (categoryId: number | null) => {
    onFiltersChange({
      ...filters,
      category_id: categoryId,
    });
  };

  return (
    <>
      <LinearGradient colors={colors.buttonGradient} style={styles.navbar}>
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
      </LinearGradient>

      <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.95)']} style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {displayCategories.map((category, index) => (
            <TouchableOpacity
              key={category.id ?? "all"}
              style={styles.categoryChipContainer}
              onPress={() => handleCategoryPress(category.id)}
            >
              <LinearGradient
                colors={
                  filters.category_id === category.id || (filters.category_id === null && category.id === null)
                    ? colors.buttonGradient
                    : ['#ffffff', '#f1f5f9']
                }
                style={[
                  styles.categoryChip,
                  filters.category_id === category.id && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    (filters.category_id === category.id || (filters.category_id === null && category.id === null)) &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: colors.fontWeightSemiBold,
  },
  searchInputFocused: {
    color: colors.textDark,
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
  categoryChipText: {
    fontSize: colors.fontSizeSm,
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: colors.fontWeightBold,
  },
});

export default Navbar;
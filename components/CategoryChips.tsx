import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiBaseUrl } from '../config/apiConfig'; // Adjust the path as needed

const categoryIcons: { [key: string]: any } = {
  'All': 'apps-outline',
  'Electronics': 'phone-portrait-outline',
  'Fashion': 'shirt-outline',
  'Home': 'home-outline',
  'Books': 'book-outline',
  'Sports': 'fitness-outline',
};

const colors = {
  primary: '#667eea',
  buttonGradient: ['#667eea', '#764ba2'] as [string, string],
  backgroundCard: '#ffffff',
  borderRadius: 12,
  borderRadiusLarge: 20,
  spacingMd: 16,
  spacingSm: 8,
  fontSizeSm: 14,
  fontWeightSemiBold: '600' as const,
};

type CategoryType = {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  productCount?: number;
};

type Props = {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
};

const CategoryChips: React.FC<Props> = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color={colors.primary} style={{ margin: 12 }} />;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
      {categories.map((category, idx) => (
        <TouchableOpacity
          key={category.id ?? idx}
          style={styles.categoryChipContainer}
          onPress={() => onCategorySelect(category.name)}
        >
          <LinearGradient
            colors={selectedCategory === category.name ? colors.buttonGradient : ['#ffffff', '#f1f5f9']}
            style={[
              styles.categoryChip,
              selectedCategory === category.name && styles.categoryChipActive,
            ]}
          >
            <Ionicons
              name={categoryIcons[category.name] || 'cube-outline'}
              size={16}
              color={selectedCategory === category.name ? 'white' : colors.primary}
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryScroll: {
    maxHeight: 60,
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
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
  },
  categoryChipActive: {
    elevation: 2,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: colors.fontSizeSm,
    color: colors.primary,
    fontWeight: colors.fontWeightSemiBold,
  },
  categoryChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CategoryChips;
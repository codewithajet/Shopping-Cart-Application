// File: app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';

// Type definitions
interface TabIconProps {
  name: 'shop' | 'catigories'| 'profile';
  size: number;
  color: string;
  focused: boolean;
}

interface TabBarIconProps {
  color: string;
  focused: boolean;
  size?: number;
}

// Using Expo Vector Icons instead of IconSymbol for better compatibility
const TabIcon: React.FC<TabIconProps> = ({ name, size, color, focused }) => {
  const iconMap: Record<TabIconProps['name'], string> = {
    'shop': focused ? 'storefront' : 'storefront-outline',
    'catigories': focused ? 'grid' : 'grid-outline', 
    // 'Cart': focused ? 'bag' : 'bag-outline',
    'profile': focused ? 'person-circle' : 'person-circle-outline'
  };
  
  return (
    <Ionicons 
      name={iconMap[name] as any}
      size={size} 
      color={color}
      style={[
        styles.icon,
        {
          transform: [{ scale: focused ? 1.05 : 1 }],
          opacity: focused ? 1 : 0.85,
        }
      ]}
    />
  );
};

// Stunning glassmorphism tab bar background
const GlassmorphismTabBar: React.FC = () => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={
          colorScheme === 'dark' 
            ? ['rgba(17, 24, 39, 0.8)', 'rgba(31, 41, 55, 0.9)', 'rgba(17, 24, 39, 0.95)'] 
            : ['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.8)', 'rgba(255, 255, 255, 0.9)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      <BlurView
        intensity={colorScheme === 'dark' ? 20 : 30}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.blurOverlay}
      />
      
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)']
            : ['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderGradient}
      />
    </View>
  );
};

export default function TabLayout(): React.JSX.Element {
  const colorScheme = useColorScheme();

  const tabColors = {
    light: {
      active: '#8b5cf6',
      activeSecondary: '#3b82f6',
      inactive: '#6b7280',
      background: 'transparent',
      shadow: 'rgba(139, 92, 246, 0.25)',
    },
    dark: {
      active: '#a78bfa',
      activeSecondary: '#60a5fa',
      inactive: '#9ca3af',
      background: 'transparent',
      shadow: 'rgba(167, 139, 250, 0.3)',
    }
  } as const;

  const currentColors = tabColors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.active,
        tabBarInactiveTintColor: currentColors.inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <GlassmorphismTabBar />,
        tabBarStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: 10,
          right: 10,
          marginBottom: Platform.OS === 'ios' ? 25 : 15,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          height: Platform.OS === 'ios' ? 75 : 65,
          borderRadius: 25,
          paddingBottom: Platform.OS === 'ios' ? 15 : 8,
          paddingTop: 12,
          paddingHorizontal: 15,
          shadowColor: currentColors.shadow,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        },
        tabBarLabelStyle: {
          fontFamily: 'SpaceMono',
          fontSize: 11,
          fontWeight: '700' as const,
          marginTop: 2,
          textShadowColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }: TabBarIconProps) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={[currentColors.active, currentColors.activeSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradientBg}
                />
              )}
              <TabIcon 
                size={focused ? 26 : 22} 
                name="shop" 
                color={focused ? '#ffffff' : color}
                focused={focused}
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }: TabBarIconProps) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={[currentColors.active, currentColors.activeSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradientBg}
                />
              )}
              <TabIcon 
                size={focused ? 26 : 22} 
                name="catigories" 
                color={focused ? '#ffffff' : color}
                focused={focused}
              />
            </View>
          ),
        }}
      />
      
      {/* <Tabs.Screen
        name="Cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }: TabBarIconProps) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={[currentColors.active, currentColors.activeSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradientBg}
                />
              )}
              <TabIcon 
                size={focused ? 26 : 22} 
                name="Cart" 
                color={focused ? '#ffffff' : color}
                focused={focused}
              />
              <View style={styles.cartBadge}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.badgeGradient}
                />
              </View>
            </View>
          ),
        }}
      /> */}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }: TabBarIconProps) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={[currentColors.active, currentColors.activeSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradientBg}
                />
              )}
              <TabIcon 
                size={focused ? 26 : 22} 
                name="profile" 
                color={focused ? '#ffffff' : color}
                focused={focused}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    overflow: 'hidden' as const,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  borderGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  iconContainer: {
    position: 'relative' as const,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  },
  iconContainerFocused: {
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradientBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  icon: {
    zIndex: 1,
  },
  cartBadge: {
    position: 'absolute' as const,
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden' as const,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeGradient: {
    flex: 1,
    borderRadius: 6,
  },
});

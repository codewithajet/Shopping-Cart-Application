import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { useAppTheme } from '../../constants/ThemeContext'; // Use your ThemeContext for theme sync

// Type definitions
interface TabIconProps {
  name: 'shop' | 'catigories' | 'profile';
  size: number;
  color: string;
  focused: boolean;
}

interface TabBarIconProps {
  color: string;
  focused: boolean;
  size?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, size, color, focused }) => {
  const iconMap: Record<TabIconProps['name'], string> = {
    'shop': focused ? 'storefront' : 'storefront-outline',
    'catigories': focused ? 'grid' : 'grid-outline',
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
          transform: [{ scale: focused ? 1.1 : 1 }],
          opacity: focused ? 1 : 0.82,
        }
      ]}
    />
  );
};

const GlassmorphismTabBar: React.FC = () => {
  const { theme } = useAppTheme();
  const colorScheme = theme;
  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['rgba(17,24,39,0.8)', 'rgba(31,41,55,0.92)', 'rgba(17,24,39,0.96)']
            : ['rgba(255,255,255,0.65)', 'rgba(248,250,252,0.7)', 'rgba(255,255,255,0.9)']
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
            ? ['rgba(139,92,246,0.23)', 'rgba(59,130,246,0.25)', 'rgba(16,185,129,0.22)']
            : ['rgba(139,92,246,0.14)', 'rgba(59,130,246,0.17)', 'rgba(16,185,129,0.12)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderGradient}
      />
    </View>
  );
};

export default function TabLayout(): React.JSX.Element {
  const { theme } = useAppTheme();
  const colorScheme = theme;

  const tabColors = {
    light: {
      active: '#8b5cf6',
      activeSecondary: '#3b82f6',
      inactive: '#6b7280',
      background: 'transparent',
      shadow: 'rgba(139,92,246,0.25)',
    },
    dark: {
      active: '#a78bfa',
      activeSecondary: '#60a5fa',
      inactive: '#9ca3af',
      background: 'transparent',
      shadow: 'rgba(167,139,250,0.32)',
    }
  } as const;

  const currentColors = tabColors[(colorScheme ?? 'light') as 'light' | 'dark'];

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
              height: 6,
            },
            shadowOpacity: 0.41,
            shadowRadius: 16,
          },
          tabBarLabelStyle: {
            fontFamily: 'SpaceMono',
            fontSize: 12,
            fontWeight: '700' as const,
            marginTop: 2,
            textShadowColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          },
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}
      >
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
                  color={focused ? '#fff' : color}
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
                  color={focused ? '#fff' : color}
                  focused={focused}
                />
              </View>
            ),
          }}
        />
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
                  color={focused ? '#fff' : color}
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
    width: 38,
    height: 38,
    borderRadius: 19,
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
    shadowRadius: 9,
    elevation: 9,
  },
  iconGradientBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
  },
  icon: {
    zIndex: 1,
  },
});
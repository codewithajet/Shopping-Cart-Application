import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Beautiful custom tab bar background component
const BeautifulTabBarBackground = () => {
  const colorScheme = useColorScheme();
  
  return (
    <LinearGradient
      colors={
        colorScheme === 'dark' 
          ? ['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.98)'] 
          : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.98)']
      }
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Platform.OS === 'ios' ? 90 : 70,
      }}
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Enhanced color scheme with beautiful gradients
  const tabColors = {
    light: {
      active: '#667eea',
      inactive: '#94a3b8',
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(226, 232, 240, 0.8)',
    },
    dark: {
      active: '#38f9d7',
      inactive: '#64748b',
      background: 'rgba(30, 41, 59, 0.95)',
      border: 'rgba(51, 65, 85, 0.8)',
    }
  };

  const currentColors = tabColors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.active,
        tabBarInactiveTintColor: currentColors.inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: BeautifulTabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          // Beautiful shadow
          shadowColor: colorScheme === 'dark' ? '#000' : '#667eea',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontFamily: 'SpaceMono',
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}>
      
      {/* Home Tab - matches your existing index.tsx file */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="house.fill" 
              color={color}
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }}
      />
      
      {/* Explore Tab - matches your existing explore.tsx file */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="paperplane.fill" 
              color={color}
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
                opacity: focused ? 1 : 0.8,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
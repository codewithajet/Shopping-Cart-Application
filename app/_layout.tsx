import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../components/CartContext'; // <-- Import the CartProvider

// Enhanced custom themes with beautiful gradients and modern colors
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#667eea',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1a202c',
    border: '#e2e8f0',
    notification: '#38f9d7',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#667eea',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    border: '#334155',
    notification: '#38f9d7',
  },
};

// Beautiful gradient backgrounds
const LightGradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2', '#f093fb']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientContainer}
  >
    <View style={styles.overlay}>
      {children}
    </View>
  </LinearGradient>
);

const DarkGradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient
    colors={['#0f172a', '#1e293b', '#334155']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientContainer}
  >
    <View style={styles.darkOverlay}>
      {children}
    </View>
  </LinearGradient>
);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded] = useFonts({
    // Using only available fonts - SpaceMono for beautiful UI
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Enhanced loading screen with gradient
  if (!loaded) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          {/* You can add a beautiful loading spinner or logo here */}
        </View>
      </LinearGradient>
    );
  }

  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
  const GradientBackground = colorScheme === 'dark' ? DarkGradientBackground : LightGradientBackground;

  return (
    <CartProvider>
      <ThemeProvider value={theme}>
        <GradientBackground>
          {/* Fixed StatusBar - removed backgroundColor and translucent conflict */}
          <StatusBar 
            style={colorScheme === 'dark' ? 'light' : 'dark'} 
          />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              // Enhanced stack navigator options for beautiful transitions
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            {/* Main tabs navigation */}
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="product/[id]" // <-- No leading slash!
              options={{
                title: 'Product Details',
                headerShown: true,
                headerTransparent: true,
                headerTintColor: colorScheme === 'dark' ? '#f1f5f9' : '#1a202c',
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                },
                headerStyle: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="settings" 
              options={{
                title: 'Settings',
                headerShown: true,
                headerTransparent: true,
                headerTintColor: colorScheme === 'dark' ? '#f1f5f9' : '#1a202c',
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                },
                headerStyle: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                presentation: 'modal',
              }} 
            />
            
            {/* Catch-all for unmatched routes */}
            <Stack.Screen 
              name="+not-found" 
              options={{
                title: 'Page Not Found',
                headerShown: true,
                headerTransparent: true,
                headerTintColor: colorScheme === 'dark' ? '#f1f5f9' : '#1a202c',
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                },
              }} 
            />
          </Stack>
        </GradientBackground>
      </ThemeProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
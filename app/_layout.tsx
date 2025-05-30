import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../components/CartContext';

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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          {/* Optional loading spinner or logo here */}
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
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="product/[id]"
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
                // Custom gradient header for product details, with back arrow
                header: ({ navigation }) => (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={{
                      flex: 1,
                      height: Platform.OS === 'ios' ? 110 : 80,
                      paddingTop: Platform.OS === 'ios' ? 50 : 30,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate('(tabs)')}
                      style={{
                        marginRight: 12,
                        padding: 4,
                        borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.12)',
                      }}
                      accessibilityLabel="Go back"
                    >
                      <Ionicons
                        name="arrow-back"
                        size={26}
                        color={colorScheme === 'dark' ? '#f1f5f9' : '#fff'}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colorScheme === 'dark' ? '#f1f5f9' : '#fff',
                        fontFamily: 'SpaceMono',
                        fontSize: 18,
                        fontWeight: '600',
                      }}
                    >
                      Product Details
                    </Text>
                  </LinearGradient>
                ),
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
                  backgroundColor: '#fff',
                },
                presentation: 'modal',
              }}
            />
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
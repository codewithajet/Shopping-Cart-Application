import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider } from '../components/CartContext';

import { ThemeProvider, useAppTheme } from '../constants/ThemeContext'; // <- import your ThemeContext
import { Colors } from '../constants/Colors'; // <- your color palette

// Enhanced custom themes using your Colors palette
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
};

const LightGradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
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
    colors={['#374151', '#1f2937']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientContainer}
  >
    <View style={styles.darkOverlay}>
      {children}
    </View>
  </LinearGradient>
);

// This hook uses the ThemeContext value for color scheme
function useColorScheme() {
  const { theme } = useAppTheme();
  return theme;
}

function MainLayout() {
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
          <Ionicons name="cart" size={56} color="#fff" />
        </View>
      </LinearGradient>
    );
  }

  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
  const GradientBackground = colorScheme === 'dark' ? DarkGradientBackground : LightGradientBackground;

  return (
    <CartProvider>
      <NavigationThemeProvider value={theme}>
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
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                },
                header: ({ navigation }) => (
                  <LinearGradient
                    colors={colorScheme === 'dark'
                      ? ['#374151', '#1f2937']
                      : ['#667eea', '#764ba2']}
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
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(31,41,55,0.24)'
                          : 'rgba(255,255,255,0.15)',
                      }}
                      accessibilityLabel="Go back"
                    >
                      <Ionicons
                        name="arrow-back"
                        size={26}
                        color={colorScheme === 'dark' ? '#f9fafb' : '#fff'}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colorScheme === 'dark' ? '#f9fafb' : '#fff',
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
              name="Checkout"
              options={{
                title: 'Checkout',
                headerShown: true,
                headerTransparent: true,
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.background,
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
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.background,
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
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontFamily: 'SpaceMono',
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                },
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
            />
          </Stack>
        </GradientBackground>
      </NavigationThemeProvider>
    </CartProvider>
  );
}

// Make sure to wrap with your ThemeProvider at the root
export default function RootLayout() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
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
    backgroundColor: 'rgba(0, 0, 0, 0.27)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    padding: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 29, 137, 0.11)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 10,
  },
});
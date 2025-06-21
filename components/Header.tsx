import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
  forcedTheme?: 'light' | 'dark';
}

const commonColors = {
  primary: '#667eea',
  secondary: '#f59e0b',
  secondaryDark: '#d97706',
  accent: '#10b981',
  success: '#10b981',
  warning: '#f59e0b',
  red: '#dc2626',
  white: '#ffffff',
  borderRadiusLarge: 20,
  borderRadiusMedium: 12,
  borderRadiusSmall: 8,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  fontSizeXs: 11,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 24,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

// Custom Logo Component with theme support
const Logo: React.FC<{ palette: typeof Colors.light }> = ({ palette }) => {
  return (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={palette.cardGradient || [palette.primary, palette.primary]}
        style={[styles.logoBackground, { shadowColor: palette.shadow || '#000' }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoIcon}>
          {/* Creating a stylized "K" logo using geometric shapes */}
          <View style={[styles.logoLine1, { backgroundColor: palette.background }]} />
          <View style={[styles.logoLine2, { backgroundColor: palette.background }]} />
          <View style={[styles.logoLine3, { backgroundColor: palette.background }]} />
        </View>
      </LinearGradient>
    </View>
  );
};

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartPress, forcedTheme }) => {
  const { theme: appTheme } = useAppTheme();

  // Select theme - fallback to 'light' if theme is undefined
  const themeName: 'light' | 'dark' = 
    forcedTheme || 
    (typeof appTheme === 'string' ? appTheme as 'light' | 'dark' : 'light');
  
  const palette = Colors[themeName];
  const isDark = themeName === 'dark';

  const dynamicStyles = createDynamicStyles(palette, isDark);

  return (
    <>
      {/* Status bar styling */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1f2937' : '#ffffff'}
        translucent={false}
      />

      <LinearGradient
        colors={palette.cardGradient || [palette.primary, palette.primary]}
        style={[styles.headerGradient, dynamicStyles.headerGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          {/* Logo and Brand Section */}
          <View style={styles.brandSection}>
            <Logo palette={palette} />
            <View style={styles.brandTextContainer}>
              <Text style={[styles.brandName, dynamicStyles.brandName]}>Kidaf</Text>
              <Text style={[styles.brandTagline, dynamicStyles.brandTagline]}>Premium Shopping</Text>
            </View>
          </View>

          {/* Right Section with Icons */}
          <View style={styles.rightSection}>
            {/* Notifications Icon */}
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                <Ionicons 
                  name="notifications-outline" 
                  size={22} 
                  color={palette.text} 
                />
                <View style={[styles.notificationDot, dynamicStyles.notificationDot]} />
              </View>
            </TouchableOpacity>

            {/* Cart Button */}
            <TouchableOpacity onPress={onCartPress} style={styles.cartButton} activeOpacity={0.7}>
              <View style={[styles.cartIconContainer, dynamicStyles.cartIconContainer]}>
                <Ionicons 
                  name="bag-outline" 
                  size={24} 
                  color={palette.text} 
                />
                {cartItemsCount > 0 && (
                  <LinearGradient
                    colors={[commonColors.secondary, commonColors.secondaryDark]}
                    style={[styles.badge, dynamicStyles.badge]}
                  >
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </Text>
                  </LinearGradient>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Bottom highlight line */}
        <View style={[styles.headerHighlight, dynamicStyles.headerHighlight]} />
      </LinearGradient>
    </>
  );
};

const createDynamicStyles = (palette: typeof Colors.light, isDark: boolean) => StyleSheet.create({
  headerGradient: {
    shadowColor: isDark ? '#000' : palette.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  brandName: {
    color: palette.text,
    textShadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
  },
  brandTagline: {
    color: palette.text,
    opacity: isDark ? 0.7 : 0.6,
  },
  iconContainer: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  },
  cartIconContainer: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  },
  notificationDot: {
    backgroundColor: commonColors.red,
    borderColor: palette.background,
    shadowColor: isDark ? commonColors.red : 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.5 : 0,
    shadowRadius: 2,
  },
  badge: {
    borderColor: palette.background,
    backgroundColor: commonColors.secondary,
  },
  headerHighlight: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  },
});

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: commonColors.spacingLg,
    paddingVertical: commonColors.spacingSm,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: commonColors.spacingMd,
  },
  logoBackground: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  logoLine1: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 3,
    height: 20,
    borderRadius: 1.5,
  },
  logoLine2: {
    position: 'absolute',
    left: 8,
    top: 2,
    width: 12,
    height: 3,
    borderRadius: 1.5,
    transform: [{ rotate: '25deg' }],
  },
  logoLine3: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 12,
    height: 3,
    borderRadius: 1.5,
    transform: [{ rotate: '-25deg' }],
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: commonColors.fontSizeXl,
    fontWeight: commonColors.fontWeightExtraBold,
    letterSpacing: -0.5,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  brandTagline: {
    fontSize: commonColors.fontSizeXs,
    fontWeight: commonColors.fontWeightMedium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: -2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: commonColors.spacingSm,
  },
  notificationButton: {
    marginRight: commonColors.spacingXs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  cartButton: {
    marginLeft: commonColors.spacingXs,
  },
  cartIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: commonColors.borderRadiusMedium,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    color: commonColors.white,
    fontSize: commonColors.fontSizeXs,
    fontWeight: commonColors.fontWeightBold,
    textAlign: 'center',
  },
  headerHighlight: {
    height: 1,
    opacity: 0.6,
  },
});

export default Header;
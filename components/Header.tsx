import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
}

// Enhanced color scheme matching your ProductList
const colors = {
  primary: '#3f51b5',
  primaryLight: '#757de8',
  primaryDark: '#002984',
  secondary: '#ff4081',
  secondaryLight: '#ff79b0',
  secondaryDark: '#c60055',
  accent: '#00bcd4',
  textColor: '#2c3e50',
  textLight: '#7f8c8d',
  textLighter: '#bdc3c7',
  backgroundCard: '#ffffff',
  backgroundHover: '#f1f5f9',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  success: '#10b981',
  warning: '#f59e0b',
};

// Custom Logo Component (SVG-like using React Native elements)
const Logo: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.logoBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoIcon}>
          {/* Creating a stylized "K" logo using geometric shapes */}
          <View style={styles.logoLine1} />
          <View style={styles.logoLine2} />
          <View style={styles.logoLine3} />
        </View>
      </LinearGradient>
    </View>
  );
};

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartPress }) => {
  return (
    <>
      {/* Status bar styling */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primaryDark} 
        translucent={false}
      />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          {/* Logo and Brand Section */}
          <View style={styles.brandSection}>
            <Logo />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>Kidaf</Text>
              <Text style={styles.brandTagline}>Premium Shopping</Text>
            </View>
          </View>

          {/* Right Section with Cart */}
          <View style={styles.rightSection}>
            {/* Search Icon */}
            {/* <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <Ionicons name="search-outline" size={22} color={colors.backgroundCard} />
              </View>
            </TouchableOpacity> */}

            {/* Notifications Icon */}
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={22} color={colors.backgroundCard} />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>

            {/* Cart Button */}
            <TouchableOpacity onPress={onCartPress} style={styles.cartButton} activeOpacity={0.7}>
              <View style={styles.cartIconContainer}>
                <Ionicons name="bag-outline" size={24} color={colors.backgroundCard} />
                {cartItemsCount > 0 && (
                  <LinearGradient
                    colors={[colors.secondary, colors.secondaryDark]}
                    style={styles.badge}
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
        <View style={styles.headerHighlight} />
      </LinearGradient>

      {/* Welcome section */}
      <View style={styles.welcomeSection}>
        <LinearGradient
          colors={[colors.backgroundCard, colors.backgroundHover]}
          style={styles.welcomeGradient}
        >
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Good Morning! 👋</Text>
              <Text style={styles.welcomeSubtitle}>Discover amazing products today</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.profileGradient}
              >
                <Ionicons name="person" size={20} color={colors.backgroundCard} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Account for status bar on iOS
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 12,
  },
  logoBackground: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: colors.backgroundCard,
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
    backgroundColor: colors.backgroundCard,
    borderRadius: 1.5,
  },
  logoLine2: {
    position: 'absolute',
    left: 8,
    top: 2,
    width: 12,
    height: 3,
    backgroundColor: colors.backgroundCard,
    borderRadius: 1.5,
    transform: [{ rotate: '25deg' }],
  },
  logoLine3: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 12,
    height: 3,
    backgroundColor: colors.backgroundCard,
    borderRadius: 1.5,
    transform: [{ rotate: '-25deg' }],
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.backgroundCard,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  brandTagline: {
    fontSize: 11,
    color: colors.backgroundCard,
    opacity: 0.9,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: -2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchButton: {
    marginRight: 4,
  },
  notificationButton: {
    marginRight: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    borderWidth: 1.5,
    borderColor: colors.backgroundCard,
  },
  cartButton: {
    marginLeft: 4,
  },
  cartIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundCard,
    elevation: 3,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  badgeText: {
    color: colors.backgroundCard,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerHighlight: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.6,
  },
  welcomeSection: {
    backgroundColor: colors.backgroundCard,
  },
  welcomeGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textColor,
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  profileButton: {
    elevation: 3,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
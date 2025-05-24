import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinDate: string;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface ProfileProps {
  user?: UserProfile;
  onEditProfile?: () => void;
  onOrderHistory?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
}

const { width } = Dimensions.get('window');

const Profile: React.FC<ProfileProps> = ({
  user,
  onEditProfile,
  onOrderHistory,
  onSettings,
  onLogout,
  onBack
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Default user data for demo
  const defaultUser: UserProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
    membershipLevel: 'Gold',
    totalOrders: 42,
    totalSpent: 1284.50,
    loyaltyPoints: 2847,
  };

  const userProfile = user || defaultUser;

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'Platinum': return ['#E5E7EB', '#9CA3AF'];
      case 'Gold': return ['#FCD34D', '#F59E0B'];
      case 'Silver': return ['#E5E7EB', '#6B7280'];
      default: return ['#F59E0B', '#D97706'];
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Signed Out', 'You have been successfully signed out.', [
              { text: 'OK', onPress: () => onLogout?.() }
            ]);
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: onEditProfile,
      showArrow: true,
    },
    {
      id: 'orders',
      title: 'Order History',
      subtitle: `${userProfile.totalOrders} total orders`,
      icon: 'receipt-outline',
      onPress: onOrderHistory,
      showArrow: true,
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      subtitle: 'Saved items and wishlists',
      icon: 'heart-outline',
      onPress: () => Alert.alert('Coming Soon', 'Favorites feature coming soon!'),
      showArrow: true,
    },
    {
      id: 'addresses',
      title: 'Delivery Addresses',
      subtitle: 'Manage your delivery locations',
      icon: 'location-outline',
      onPress: () => Alert.alert('Coming Soon', 'Address management coming soon!'),
      showArrow: true,
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      subtitle: 'Cards and payment options',
      icon: 'card-outline',
      onPress: () => Alert.alert('Coming Soon', 'Payment methods coming soon!'),
      showArrow: true,
    },
  ];

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Order updates and promotions',
      icon: 'notifications-outline',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: 'location',
      title: 'Location Services',
      subtitle: 'For better delivery experience',
      icon: 'location-outline',
      value: locationEnabled,
      onToggle: setLocationEnabled,
    },
    {
      id: 'darkmode',
      title: 'Dark Mode',
      subtitle: 'Easier on the eyes',
      icon: 'moon-outline',
      value: darkModeEnabled,
      onToggle: setDarkModeEnabled,
    },
  ];

  const supportItems = [
    {
      id: 'help',
      title: 'Help Center',
      subtitle: 'FAQ and support articles',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help Center', 'Opening help center...'),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      subtitle: '24/7 customer service',
      icon: 'chatbubble-outline',
      onPress: () => Alert.alert('Contact Support', 'Opening chat support...'),
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      icon: 'star-outline',
      onPress: () => Alert.alert('Feedback', 'Opening feedback form...'),
    },
  ];

  const renderMenuItem = (item: any, isLast = false) => (
    <Animated.View
      key={item.id}
      style={[
        styles.menuItem,
        !isLast && styles.menuItemBorder,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.menuItemContent}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIconContainer}>
            <Ionicons name={item.icon as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        {item.showArrow && (
          <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSettingItem = (item: any, isLast = false) => (
    <Animated.View
      key={item.id}
      style={[
        styles.menuItem,
        !isLast && styles.menuItemBorder,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIconContainer}>
            <Ionicons name={item.icon as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.borderColor, true: colors.primaryLight }}
          thumbColor={item.value ? colors.primary : colors.textLighter}
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.backgroundCard} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={onSettings}
          >
            <Ionicons name="settings-outline" size={24} color={colors.backgroundCard} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.backgroundCard, colors.backgroundHover]}
            style={styles.profileCardGradient}
          >
            {/* Avatar and Basic Info */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                <View style={styles.avatarBadge}>
                  <LinearGradient
                    colors={getMembershipColor(userProfile.membershipLevel)}
                    style={styles.membershipBadge}
                  >
                    <Text style={styles.membershipText}>
                      {userProfile.membershipLevel.charAt(0)}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <Text style={styles.userEmail}>{userProfile.email}</Text>
                <View style={styles.membershipContainer}>
                  <Ionicons name="diamond" size={12} color={colors.secondary} />
                  <Text style={styles.membershipLevel}>
                    {userProfile.membershipLevel} Member
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.totalOrders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${userProfile.totalSpent.toFixed(0)}</Text>
                <Text style={styles.statLabel}>Spent</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.loyaltyPoints.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => 
              renderMenuItem(item, index === menuItems.length - 1)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuContainer}>
            {settingsItems.map((item, index) => 
              renderSettingItem(item, index === settingsItems.length - 1)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuContainer}>
            {supportItems.map((item, index) => 
              renderMenuItem(item, index === supportItems.length - 1)
            )}
          </View>
        </View>

        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 Your App Name</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Enhanced Color Palette
const colors = {
  primary: '#3f51b5',
  primaryLight: '#757de8',
  primaryDark: '#002984',
  secondary: '#ff4081',
  secondaryLight: '#ff79b0',
  secondaryDark: '#c60055',
  error: '#f44336',
  textColor: '#333',
  textLight: '#666',
  textLighter: '#888',
  backgroundMain: '#f5f7fa',
  backgroundCard: '#fff',
  backgroundHover: '#f0f2f5',
  borderColor: '#e1e4e8',
  borderRadius: 12,
  borderRadiusLg: 16,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontWeightMedium: '500' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    paddingTop: 50,
    paddingBottom: colors.spacingLg,
    paddingHorizontal: colors.spacingLg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.backgroundCard,
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: colors.spacingXl,
  },
  profileCard: {
    margin: colors.spacingLg,
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  profileCardGradient: {
    padding: colors.spacingLg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: colors.spacingLg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: colors.spacingLg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.backgroundCard,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  membershipBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundCard,
  },
  membershipText: {
    fontSize: colors.fontSizeXs,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.backgroundCard,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: colors.fontSizeXl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.textColor,
    marginBottom: colors.spacingXs,
  },
  userEmail: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    marginBottom: colors.spacingSm,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipLevel: {
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightMedium,
    color: colors.secondary,
    marginLeft: colors.spacingXs,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: colors.spacingLg,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: colors.fontSizeXl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.primary,
    marginBottom: colors.spacingXs,
  },
  statLabel: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderColor,
  },
  section: {
    marginTop: colors.spacingLg,
  },
  sectionTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
    marginHorizontal: colors.spacingLg,
    marginBottom: colors.spacingMd,
  },
  menuContainer: {
    backgroundColor: colors.backgroundCard,
    marginHorizontal: colors.spacingLg,
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItem: {
    backgroundColor: colors.backgroundCard,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: colors.spacingLg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: colors.spacingMd,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightMedium,
    color: colors.textColor,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
  },
  logoutContainer: {
    marginHorizontal: colors.spacingLg,
    marginTop: colors.spacingXl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    padding: colors.spacingLg,
    borderRadius: colors.borderRadiusLg,
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  logoutText: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightMedium,
    color: colors.error,
    marginLeft: colors.spacingSm,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: colors.spacingXl,
    marginBottom: colors.spacingLg,
  },
  appInfoText: {
    fontSize: colors.fontSizeXs,
    color: colors.textLighter,
    marginBottom: colors.spacingXs,
  },
});

export default Profile;
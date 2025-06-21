import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Use your app's theme context for global dark/light mode
import { useAppTheme } from '../../constants/ThemeContext';
import { Colors } from '../../constants/Colors';

const ProfileItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  iconColor?: string;
  iconBgColor?: string;
}> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
  iconColor,
  iconBgColor,
}) => {
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  return (
    <TouchableOpacity
      style={[
        styles.profileItem,
        { backgroundColor: palette.card }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: iconBgColor || (theme === 'dark' ? '#374151' : '#f3f4f6') }
        ]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={iconColor || palette.icon}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.profileTitle,
            { color: palette.text }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.profileSubtitle,
              { color: palette.icon }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.profileItemRight}>
        {rightElement}
        {showArrow && !rightElement && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={palette.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => {
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  return (
    <View style={[
      styles.statCard,
      { backgroundColor: palette.card }
    ]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[
        styles.statValue,
        { color: palette.text }
      ]}>
        {value}
      </Text>
      <Text style={[
        styles.statTitle,
        { color: palette.icon }
      ]}>
        {title}
      </Text>
    </View>
  );
};

export default function ProfileScreen(): React.JSX.Element {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  const [userInfo] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'Member since March 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const showComingSoon = (feature: string) => {
    Alert.alert(
      'Coming Soon',
      `${feature} feature will be available in a future update.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleEditProfile = () => {
    showComingSoon('Profile Editing');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: palette.background }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={palette.text}
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          { color: palette.text }
        ]}>
          Profile
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={palette.tint}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={palette.tint}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeaderContainer}>
          <LinearGradient
            colors={palette.cardGradient as [string, string]}
            style={styles.profileHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: userInfo.avatar }}
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={styles.avatarEditButton}
                  onPress={() => showComingSoon('Avatar Upload')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
              <Text style={styles.memberSince}>{userInfo.memberSince}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Orders"
            value="47"
            icon="bag-outline"
            color="#10b981"
          />
          <StatCard
            title="Wishlist Items"
            value="23"
            icon="heart-outline"
            color="#f59e0b"
          />
          <StatCard
            title="Reward Points"
            value="1,248"
            icon="star-outline"
            color="#8b5cf6"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: palette.icon }
          ]}>
            QUICK ACTIONS
          </Text>
          
          <ProfileItem
            icon="bag-outline"
            title="Order History"
            subtitle="View all your past orders"
            iconColor="#10b981"
            iconBgColor="#d1fae5"
            onPress={() => showComingSoon('Order History')}
          />
          
          <ProfileItem
            icon="heart-outline"
            title="Wishlist"
            subtitle="23 items saved"
            iconColor="#f59e0b"
            iconBgColor="#fef3c7"
            onPress={() => showComingSoon('Wishlist')}
          />
          
          <ProfileItem
            icon="location-outline"
            title="Addresses"
            subtitle="Manage shipping addresses"
            iconColor="#3b82f6"
            iconBgColor="#dbeafe"
            onPress={() => showComingSoon('Address Management')}
          />
          
          <ProfileItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Manage cards and wallets"
            iconColor="#8b5cf6"
            iconBgColor="#ede9fe"
            onPress={() => showComingSoon('Payment Methods')}
          />
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: palette.icon }
          ]}>
            ACCOUNT INFORMATION
          </Text>
          
          <ProfileItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Name, email, phone number"
            onPress={() => showComingSoon('Personal Info')}
          />
          
          <ProfileItem
            icon="key-outline"
            title="Security"
            subtitle="Password and authentication"
            onPress={() => showComingSoon('Security Settings')}
          />
          
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your preferences"
            onPress={() => showComingSoon('Notification Settings')}
          />
        </View>

        {/* Rewards & Benefits */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: palette.icon }
          ]}>
            REWARDS & BENEFITS
          </Text>
          
          <ProfileItem
            icon="star-outline"
            title="Loyalty Program"
            subtitle="Gold Member • 1,248 points"
            rightElement={
              <View style={styles.loyaltyBadge}>
                <Text style={styles.loyaltyBadgeText}>GOLD</Text>
              </View>
            }
            showArrow={true}
            onPress={() => showComingSoon('Loyalty Program')}
          />
          
          <ProfileItem
            icon="gift-outline"
            title="Referrals"
            subtitle="Invite friends and earn rewards"
            onPress={() => showComingSoon('Referral Program')}
          />
          
          <ProfileItem
            icon="pricetag-outline"
            title="Coupons & Offers"
            subtitle="View available discounts"
            onPress={() => showComingSoon('Coupons')}
          />
        </View>

        {/* Support & Feedback */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: palette.icon }
          ]}>
            SUPPORT & FEEDBACK
          </Text>
          
          <ProfileItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() => showComingSoon('Help Center')}
          />
          
          <ProfileItem
            icon="chatbubble-outline"
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => showComingSoon('Contact Support')}
          />
          
          <ProfileItem
            icon="star-half-outline"
            title="Rate Our App"
            subtitle="Share your feedback"
            onPress={() => showComingSoon('App Rating')}
          />
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: palette.icon }
          ]}>
            APP INFORMATION
          </Text>
          
          <ProfileItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => showComingSoon('Terms of Service')}
          />
          
          <ProfileItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => showComingSoon('Privacy Policy')}
          />
          
          <ProfileItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            showArrow={false}
            onPress={() => showComingSoon('About')}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headerRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollView: {
    flex: 1,
  },
  profileHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileHeaderGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center' as const,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative' as const,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarEditButton: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statsContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  profileItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  profileItemRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  loyaltyBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  loyaltyBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  bottomSpacing: {
    height: 100,
  },
});
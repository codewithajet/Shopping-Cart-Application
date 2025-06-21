import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../constants/ThemeContext';

// --- Types ---
interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

interface SettingsSwitchProps {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

// --- Components ---
const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
}) => {
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isDark ? '#374151' : '#f3f4f6' }
        ]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.settingsTitle,
            { color: isDark ? '#f9fafb' : '#1f2937' }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.settingsSubtitle,
              { color: isDark ? '#9ca3af' : '#6b7280' }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement}
        {showArrow && !rightElement && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={isDark ? '#9ca3af' : '#9ca3af'}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}) => {
  return (
    <SettingsItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      rightElement={
        <Switch
          value={value}
          onValueChange={(val: boolean) => onValueChange(val)}
          trackColor={{ false: '#d1d5db', true: '#8b5cf6' }}
          thumbColor="#ffffff"
          ios_backgroundColor="#d1d5db"
        />
      }
      showArrow={false}
    />
  );
};

// --- Main Screen ---
export default function SettingsScreen(): React.JSX.Element {
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const isDark = theme === 'dark';

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  const showComingSoon = (feature: string) => {
    Alert.alert(
      'Coming Soon',
      `${feature} feature will be available in a future update.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            showComingSoon('Logout');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showComingSoon('Account Deletion');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? '#111827' : '#f9fafb' }
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
            color={isDark ? '#f9fafb' : '#1f2937'}
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          { color: isDark ? '#f9fafb' : '#1f2937' }
        ]}>
          Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            ACCOUNT
          </Text>

          <SettingsItem
            icon="person-outline"
            title="Profile"
            subtitle="Manage your personal information"
            onPress={() => showComingSoon('Profile Management')}
          />

          <SettingsItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Manage cards and payment options"
            onPress={() => showComingSoon('Payment Methods')}
          />

          <SettingsItem
            icon="location-outline"
            title="Addresses"
            subtitle="Manage shipping and billing addresses"
            onPress={() => showComingSoon('Address Management')}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            PREFERENCES
          </Text>

          <SettingsSwitch
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive updates about orders and offers"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingsSwitch
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            value={isDark}
            onValueChange={(val: boolean) => setTheme(val ? 'dark' : 'light')}
          />

          <SettingsSwitch
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face recognition"
            value={biometric}
            onValueChange={setBiometric}
          />

          <SettingsSwitch
            icon="location-outline"
            title="Location Services"
            subtitle="Allow location access for better experience"
            value={locationServices}
            onValueChange={setLocationServices}
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            APP SETTINGS
          </Text>

          <SettingsItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => showComingSoon('Language Selection')}
          />

          <SettingsItem
            icon="globe-outline"
            title="Country/Region"
            subtitle="United States"
            onPress={() => showComingSoon('Region Selection')}
          />

          <SettingsSwitch
            icon="sync-outline"
            title="Auto Sync"
            subtitle="Automatically sync data across devices"
            value={autoSync}
            onValueChange={setAutoSync}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            SUPPORT
          </Text>

          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => showComingSoon('Help Center')}
          />

          <SettingsItem
            icon="chatbubble-outline"
            title="Contact Us"
            subtitle="Send feedback or report issues"
            onPress={() => showComingSoon('Contact Form')}
          />

          <SettingsItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => showComingSoon('Terms of Service')}
          />

          <SettingsItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => showComingSoon('Privacy Policy')}
          />
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#9ca3af' : '#6b7280' }
          ]}>
            ACCOUNT ACTIONS
          </Text>

          <TouchableOpacity
            style={[
              styles.settingsItem,
              { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
            ]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              </View>
              <Text style={[styles.settingsTitle, { color: '#dc2626' }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingsItem,
              { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
            ]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </View>
              <Text style={[styles.settingsTitle, { color: '#dc2626' }]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[
            styles.versionText,
            { color: isDark ? '#6b7280' : '#9ca3af' }
          ]}>
            Version 1.0.0
          </Text>
        </View>
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
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
  settingsItem: {
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
  settingsItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  settingsItemRight: {
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
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  versionContainer: {
    alignItems: 'center' as const,
    paddingVertical: 32,
    paddingBottom: 100, // Extra padding for tab bar
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
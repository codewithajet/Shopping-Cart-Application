import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const { theme } = useAppTheme();
  const palette = Colors[theme];

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <LinearGradient
        colors={palette.cardGradient as [string, string]}
        style={styles.gradient}
      >
        <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name="sad-outline"
              size={74}
              color={palette.tint}
              style={{ opacity: 0.85 }}
            />
          </View>
          <ThemedText type="title" style={[styles.title, { color: palette.text }]}>
            This screen does not exist.
          </ThemedText>
          <ThemedText type="default" style={[styles.subtitle, { color: palette.icon }]}>
            Maybe you mistyped a URL, or this page was moved.
          </ThemedText>
          <Link href="/" style={styles.link}>
            <ThemedText type="link" style={[styles.linkText, { color: palette.tint }]}>
              Go to home screen!
            </ThemedText>
          </Link>
        </ThemedView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 44,
    width: 88,
    height: 88,
    marginTop: -48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 24,
    lineHeight: 22,
  },
  link: {
    marginTop: 15,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.06,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocation } from '@/context/LocationContext';
import { DESIGN } from '@/constants/theme';

export default function DaangnHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { location } = useLocation();

  return (
    <>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          <Pressable style={styles.locationButton} onPress={() => router.push('/location' as any)}>
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons name="chevron-down" size={18} color={DESIGN.textPrimary} />
          </Pressable>
          <View style={styles.icons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="search" size={22} color={DESIGN.textPrimary} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="options-outline" size={22} color={DESIGN.textPrimary} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color={DESIGN.textPrimary} />
              <View style={styles.dot} />
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.borderSubtle,
  },
  inner: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 20,
    fontWeight: '800',
    color: DESIGN.textPrimary,
    letterSpacing: -0.5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DESIGN.accent,
  },
});

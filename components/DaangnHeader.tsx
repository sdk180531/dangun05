import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocation } from '@/context/LocationContext';

const DAANGN_ORANGE = '#FF7E36';

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
            <Ionicons name="chevron-down" size={16} color={DAANGN_ORANGE} />
          </Pressable>

          <View style={styles.icons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#212121" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#212121" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="menu" size={24} color="#212121" />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
});

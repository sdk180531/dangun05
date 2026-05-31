import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocation } from '@/context/LocationContext';

const CATEGORIES = ['전체', '동네질문', '동네맛집', '생활정보', '분실/실종', '동네사건사고'];


export default function NeighborhoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { location } = useLocation();
  const [activeCategory, setActiveCategory] = useState('전체');

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable style={styles.locationBtn} onPress={() => router.push('/location' as any)}>
          <Text style={styles.locationText}>{location}</Text>
          <Ionicons name="chevron-down" size={16} color="#FF7E36" />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search" size={22} color="#212121" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color="#212121" />
          </Pressable>
        </View>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      {/* 게시글 목록 */}
      <FlatList
        data={[]}
        keyExtractor={(item) => item}
        renderItem={() => null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="create-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>아직 게시글이 없어요</Text>
            <Text style={styles.emptySubText}>이웃들과 동네 이야기를 나눠보세요</Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  locationBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 17, fontWeight: '700', color: '#212121' },
  headerRight: { flexDirection: 'row' },
  iconBtn: { padding: 6 },
  categoryScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  categoryChipActive: { borderColor: '#212121', backgroundColor: '#212121' },
  categoryText: { fontSize: 13, color: '#444' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#444' },
  emptySubText: { fontSize: 13, color: '#999' },
});

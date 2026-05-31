import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocation } from '@/context/LocationContext';
import { KOREA_LOCATIONS, KoreaLocation } from '@/data/koreaLocations';

const DAANGN_ORANGE = '#FF7E36';

export default function LocationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { location, setLocation } = useLocation();
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const filtered: KoreaLocation[] = trimmed.length === 0
    ? KOREA_LOCATIONS
    : KOREA_LOCATIONS.filter(
        (loc) =>
          loc.dong.includes(trimmed) ||
          loc.sigungu.includes(trimmed) ||
          loc.sido.includes(trimmed)
      );

  const handleSelect = (dong: string) => {
    setLocation(dong);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#212121" />
        </Pressable>
        <Text style={styles.headerTitle}>동네 선택</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 검색창 */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="동네, 시/구 이름으로 검색"
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#bbb" />
          </Pressable>
        )}
      </View>

      {/* 결과 수 표시 */}
      {trimmed.length > 0 && (
        <View style={styles.resultCount}>
          <Text style={styles.resultCountText}>검색 결과 {filtered.length}개</Text>
        </View>
      )}

      {/* 목록 또는 빈 상태 */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          <Text style={styles.emptySubText}>다른 동네 이름으로 검색해보세요</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => `${item.dong}-${item.sigungu}-${index}`}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          renderItem={({ item }) => {
            const isSelected = item.dong === location;
            return (
              <Pressable style={styles.row} onPress={() => handleSelect(item.dong)}>
                <View style={styles.rowLeft}>
                  <Text style={[styles.rowText, isSelected && styles.rowTextActive]}>
                    {item.dong}
                  </Text>
                  <Text style={styles.rowSub}>{item.sigungu} · {item.sido}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color={DAANGN_ORANGE} />
                )}
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    padding: 0,
  },
  clearBtn: { padding: 4 },
  resultCount: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  resultCountText: { fontSize: 12, color: '#999' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowLeft: { flex: 1, gap: 2 },
  rowText: { fontSize: 16, color: '#212121' },
  rowTextActive: { fontWeight: '700', color: DAANGN_ORANGE },
  rowSub: { fontSize: 12, color: '#999' },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#444', marginTop: 8 },
  emptySubText: { fontSize: 13, color: '#999' },
});

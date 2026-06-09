import { Ionicons } from '@expo/vector-icons';
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
import { DESIGN } from '@/constants/theme';

const TOPICS = ['전체', '동네질문', '동네소식', '취미생활', '맛집', '분실/실종'];

export default function NeighborhoodScreen() {
  const insets = useSafeAreaInsets();
  const { location } = useLocation();
  const [activeTopic, setActiveTopic] = useState('전체');

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>동네생활</Text>
          <Text style={styles.headerSub}>{location} · 반경 3km</Text>
        </View>
      </View>

      {/* 토픽 언더라인 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicScroll}
      >
        {TOPICS.map((topic) => {
          const active = topic === activeTopic;
          return (
            <Pressable
              key={topic}
              style={[styles.topicTab, active && styles.topicTabActive]}
              onPress={() => setActiveTopic(topic)}
            >
              <Text style={[styles.topicText, active && styles.topicTextActive]}>
                {topic}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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

      {/* FAB */}
      <Pressable style={styles.fab}>
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.fabText}>글쓰기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DESIGN.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: DESIGN.textMuted,
  },
  topicScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.borderDivider,
  },
  topicTab: {
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  topicTabActive: {
    borderBottomColor: DESIGN.accent,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '500',
    color: DESIGN.textMuted,
  },
  topicTextActive: {
    fontWeight: '800',
    color: DESIGN.accent,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN.textSecondary,
  },
  emptySubText: {
    fontSize: 13,
    color: DESIGN.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DESIGN.accent,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: DESIGN.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});

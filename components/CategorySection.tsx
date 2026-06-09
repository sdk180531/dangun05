import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { DESIGN } from '@/constants/theme';

const CATEGORIES = ['전체', '의류/패션', '도서/티켓', '전자기기', '가구/인테리어', '중고차'];

type Props = {
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategorySection({ activeCategory, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {CATEGORIES.map((cat) => {
        const active = cat === activeCategory;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
          >
            <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
              {cat}
            </Text>
          </Pressable>
        );
      })}
      <Pressable style={styles.filterBtn}>
        <Ionicons name="options-outline" size={14} color={DESIGN.textPrimary} />
        <Text style={styles.filterText}>필터</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.borderDivider,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: DESIGN.accent,
    borderColor: DESIGN.accent,
  },
  chipInactive: {
    backgroundColor: '#fff',
    borderColor: '#E8E5E0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextInactive: {
    color: DESIGN.textSecondary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: DESIGN.textPrimary,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const DAANGN_ORANGE = '#FF7E36';

type Category = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  iconColor: string;
};

const CATEGORIES: Category[] = [
  { id: '0', label: '전체',       icon: 'apps',            bgColor: '#F4F4F4', iconColor: '#444' },
  { id: '1', label: '중고거래',   icon: 'pricetag',        bgColor: '#FFF0E6', iconColor: '#FF7E36' },
  { id: '2', label: '나눔',       icon: 'gift',            bgColor: '#E6F4FF', iconColor: '#4DA6FF' },
  { id: '3', label: '알바',       icon: 'briefcase',       bgColor: '#E6FFE6', iconColor: '#33B533' },
  { id: '4', label: '부동산',     icon: 'home',            bgColor: '#F0E6FF', iconColor: '#9966FF' },
  { id: '5', label: '중고차',     icon: 'car',             bgColor: '#FFE6E6', iconColor: '#FF4D4D' },
  { id: '6', label: '게임',       icon: 'game-controller', bgColor: '#E6FFF0', iconColor: '#00B366' },
  { id: '7', label: '전자기기',   icon: 'phone-portrait',  bgColor: '#FFF5E6', iconColor: '#FF9900' },
  { id: '8', label: '가구/인테리어', icon: 'bed',          bgColor: '#E6F0FF', iconColor: '#3399FF' },
];

type Props = {
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategorySection({ activeCategory, onSelect }: Props) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.label;
          return (
            <Pressable key={cat.id} style={styles.item} onPress={() => onSelect(cat.label)}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: cat.bgColor },
                  isActive && styles.iconCircleActive,
                ]}
              >
                <Ionicons name={cat.icon} size={24} color={isActive ? DAANGN_ORANGE : cat.iconColor} />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
  item: {
    alignItems: 'center',
    width: 68,
    gap: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    borderWidth: 2,
    borderColor: DAANGN_ORANGE,
  },
  label: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
  },
  labelActive: {
    fontWeight: '700',
    color: DAANGN_ORANGE,
  },
  divider: {
    height: 8,
    backgroundColor: '#f4f4f4',
  },
});

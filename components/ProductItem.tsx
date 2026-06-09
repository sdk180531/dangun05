import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { type Product } from '@/context/ProductsContext';
import { DESIGN } from '@/constants/theme';

export type { Product };

type Props = {
  item: Product;
};

export default function ProductItem({ item }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/product/${item.id}` as any)}
    >
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, { backgroundColor: item.thumbColor }]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>{item.location} · {item.time}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.stats}>
          {item.chats > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={13} color={DESIGN.textMuted} />
              <Text style={styles.statText}>{item.chats}</Text>
            </View>
          )}
          {item.likes > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={13} color={DESIGN.textMuted} />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  thumbnail: {
    width: 104,
    height: 104,
    borderRadius: 14,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: DESIGN.textPrimary,
    lineHeight: 21,
  },
  meta: {
    fontSize: 12,
    color: DESIGN.textMuted,
    marginTop: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: DESIGN.textPrimary,
    marginTop: 6,
    letterSpacing: -0.4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 'auto' as any,
    paddingTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: DESIGN.textMuted,
  },
});

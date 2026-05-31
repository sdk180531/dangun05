import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { type Product } from '@/context/ProductsContext';

export type { Product };

type Props = {
  item: Product;
};

export default function ProductItem({ item }: Props) {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.push(`/product/${item.id}` as any)}>
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
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color="#999" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={14} color="#999" />
            <Text style={styles.statText}>{item.chats}</Text>
          </View>
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
    gap: 12,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    lineHeight: 21,
  },
  meta: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 13,
    color: '#999',
  },
});

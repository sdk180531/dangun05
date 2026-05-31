import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import DaangnHeader from '@/components/DaangnHeader';
import CategorySection from '@/components/CategorySection';
import ProductItem from '@/components/ProductItem';
import { useProducts } from '@/context/ProductsContext';

const Separator = () => <View style={styles.separator} />;

export default function HomeScreen() {
  const router = useRouter();
  const { products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered =
    activeCategory === '전체'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <View style={styles.container}>
      <DaangnHeader />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <CategorySection activeCategory={activeCategory} onSelect={setActiveCategory} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} color="#FF7E36" size="large" />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>해당 카테고리 상품이 없어요</Text>
            </View>
          )
        }
        renderItem={({ item }) => <ProductItem item={item} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
      />
      <Pressable style={styles.fab} onPress={() => router.push('/modal')}>
        <Ionicons name="pencil" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
  loader: {
    paddingTop: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF7E36',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

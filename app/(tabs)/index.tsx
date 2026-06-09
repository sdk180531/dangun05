import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import DaangnHeader from '@/components/DaangnHeader';
import CategorySection from '@/components/CategorySection';
import ProductItem from '@/components/ProductItem';
import { useProducts } from '@/context/ProductsContext';
import { useAuth } from '@/context/AuthContext';

const Separator = () => <View style={styles.separator} />;

export default function HomeScreen() {
  const router = useRouter();
  const { products, isLoading } = useProducts();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('전체');

  const tierFiltered = user?.tier === 'premium'
    ? products
    : products.filter((p) => p.tierRequired !== 'premium');

  const filtered =
    activeCategory === '전체'
      ? tierFiltered
      : tierFiltered.filter((p) => p.category === activeCategory);

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
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>상품등록하기</Text>
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
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF6F0F',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#FF6F0F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProducts } from '@/context/ProductsContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAANGN_ORANGE = '#FF7E36';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useProducts();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>상품을 찾을 수 없어요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 상단 이미지 영역 */}
        <View style={styles.imageContainer}>
          {product.imageUri ? (
            <Image source={{ uri: product.imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { backgroundColor: product.thumbColor }]} />
          )}
          {/* 이미지 위 투명 헤더 */}
          <View style={[styles.floatingHeader, { paddingTop: insets.top + 4 }]}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>
            <View style={styles.floatingHeaderRight}>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="share-outline" size={22} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* 판매자 정보 */}
        <View style={styles.sellerRow}>
          <View style={styles.avatar} />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>당근유저</Text>
            <Text style={styles.sellerLocation}>{product.location}</Text>
          </View>
          <Pressable style={styles.mannerBtn}>
            <Text style={styles.mannerBtnText}>매너평가</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productMeta}>중고거래 · {product.time}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
          <View style={styles.statsRow}>
            <Ionicons name="eye-outline" size={14} color="#bbb" />
            <Text style={styles.statText}>조회 0</Text>
            <Text style={styles.statDot}>·</Text>
            <Ionicons name="heart-outline" size={14} color="#bbb" />
            <Text style={styles.statText}>관심 {product.likes}</Text>
            <Text style={styles.statDot}>·</Text>
            <Ionicons name="chatbubble-outline" size={14} color="#bbb" />
            <Text style={styles.statText}>채팅 {product.chats}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 바 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.likeBtn}>
          <Ionicons name="heart-outline" size={24} color="#555" />
        </Pressable>
        <View style={styles.bottomDivider} />
        <Text style={styles.bottomPrice}>{product.price}</Text>
        <Pressable style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>채팅하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 15,
    color: '#999',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  floatingHeaderRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    margin: 4,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  sellerLocation: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  mannerBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mannerBtnText: {
    fontSize: 13,
    color: '#555',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  productInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 26,
  },
  productMeta: {
    fontSize: 13,
    color: '#999',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  statText: {
    fontSize: 12,
    color: '#bbb',
  },
  statDot: {
    fontSize: 12,
    color: '#bbb',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 12,
  },
  likeBtn: {
    padding: 4,
  },
  bottomDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  bottomPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  chatBtn: {
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chatBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';

const DAANGN_ORANGE = '#FF7E36';
const TEMPERATURE = 36.5;

const MENU_ITEMS = [
  { id: '1', icon: 'time-outline' as const, label: '최근 본 상품' },
  { id: '2', icon: 'shield-checkmark-outline' as const, label: '인증 정보' },
  { id: '3', icon: 'location-outline' as const, label: '동네 인증' },
  { id: '4', icon: 'chatbubbles-outline' as const, label: '받은 매너 평가' },
  { id: '5', icon: 'settings-outline' as const, label: '설정' },
];

export default function MyCarrotScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const myProducts = products.slice(0, 3);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.headerTitle}>나의 당근</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color="#212121" />
        </Pressable>
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.nickname ?? '당근유저'}</Text>
          <Pressable style={styles.editBtn}>
            <Text style={styles.editBtnText}>프로필 수정</Text>
          </Pressable>
        </View>
        {/* 당근 온도 */}
        <View style={styles.tempBox}>
          <Text style={styles.tempValue}>{TEMPERATURE}°C</Text>
          <Text style={styles.tempLabel}>당근 온도</Text>
          <View style={styles.thermometer}>
            <View style={[styles.thermometerFill, { width: `${(TEMPERATURE / 100) * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.blockDivider} />

      {/* 바로가기 3열 */}
      <View style={styles.shortcuts}>
        {[
          { icon: 'cube-outline' as const, label: '판매내역' },
          { icon: 'bag-handle-outline' as const, label: '구매내역' },
          { icon: 'heart-outline' as const, label: '관심목록' },
        ].map((item) => (
          <Pressable key={item.label} style={styles.shortcut}>
            <Ionicons name={item.icon} size={26} color="#555" />
            <Text style={styles.shortcutLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.blockDivider} />

      {/* 판매 목록 미리보기 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>판매 중인 상품</Text>
        <Pressable>
          <Text style={styles.sectionMore}>전체보기</Text>
        </Pressable>
      </View>
      {myProducts.map((product) => (
        <Pressable key={product.id} style={styles.myProductItem}>
          {product.imageUri ? (
            <Image source={{ uri: product.imageUri }} style={styles.myProductThumb} />
          ) : (
            <View style={[styles.myProductThumb, { backgroundColor: product.thumbColor }]} />
          )}
          <View style={styles.myProductInfo}>
            <Text style={styles.myProductTitle} numberOfLines={1}>{product.title}</Text>
            <Text style={styles.myProductMeta}>{product.location} · {product.time}</Text>
            <Text style={styles.myProductPrice}>{product.price}</Text>
          </View>
          <Pressable style={styles.statusBadge}>
            <Text style={styles.statusText}>판매중</Text>
          </Pressable>
        </Pressable>
      ))}

      <View style={styles.blockDivider} />

      {/* 메뉴 리스트 */}
      {MENU_ITEMS.map((item) => (
        <View key={item.id}>
          <Pressable style={styles.menuItem}>
            <Ionicons name={item.icon} size={22} color="#555" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" style={{ marginLeft: 'auto' }} />
          </Pressable>
          <View style={styles.menuDivider} />
        </View>
      ))}

      {/* 로그아웃 */}
      <Pressable style={styles.menuItem} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#FF4444" />
        <Text style={[styles.menuLabel, { color: '#FF4444' }]}>로그아웃</Text>
      </Pressable>
    </ScrollView>
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#212121' },
  iconBtn: { padding: 6 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  profileInfo: { flex: 1, gap: 8 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#212121' },
  editBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  editBtnText: { fontSize: 13, color: '#555' },
  tempBox: { alignItems: 'center', gap: 2 },
  tempValue: { fontSize: 18, fontWeight: '700', color: DAANGN_ORANGE },
  tempLabel: { fontSize: 11, color: '#999' },
  thermometer: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
    marginTop: 4,
    overflow: 'hidden',
  },
  thermometerFill: {
    height: 6,
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 3,
  },
  blockDivider: { height: 8, backgroundColor: '#f4f4f4' },
  shortcuts: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  shortcut: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  shortcutLabel: { fontSize: 13, color: '#444' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  sectionMore: { fontSize: 13, color: '#999' },
  myProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  myProductThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    flexShrink: 0,
  },
  myProductInfo: { flex: 1 },
  myProductTitle: { fontSize: 14, fontWeight: '500', color: '#212121' },
  myProductMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  myProductPrice: { fontSize: 14, fontWeight: '700', color: '#212121', marginTop: 4 },
  statusBadge: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { fontSize: 12, color: '#555' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  menuLabel: { fontSize: 15, color: '#212121' },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
});

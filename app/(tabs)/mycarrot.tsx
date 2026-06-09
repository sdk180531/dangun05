import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { DESIGN } from '@/constants/theme';

const TEMPERATURE = 36.5;

export default function MyCarrotScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const myProducts = products.slice(0, 3);

  const initial = user?.nickname?.slice(0, 1) ?? '?';

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color={DESIGN.textPrimary} />
        </Pressable>
      </View>

      {/* 프로필 */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.nickname ?? '당근유저'}</Text>
          <View style={[styles.roleBadge, user?.role === 'admin' && styles.roleBadgeAdmin]}>
            <Text style={[styles.roleBadgeText, user?.role === 'admin' && styles.roleBadgeTextAdmin]}>
              {user?.role === 'admin' ? '관리자' : '일반유저'}
            </Text>
          </View>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editBtnText}>프로필 수정</Text>
        </Pressable>
      </View>

      {/* 매너 온도 카드 */}
      <View style={styles.tempCard}>
        <View style={styles.tempCardTop}>
          <Text style={styles.tempCardLabel}>매너온도</Text>
          <Text style={styles.tempCardValue}>{TEMPERATURE}°C</Text>
        </View>
        <View style={styles.tempBar}>
          <View style={[styles.tempBarFill, { width: `${(TEMPERATURE / 100) * 100}%` as any }]} />
        </View>
        <View style={styles.tempBadges}>
          {['빠른 응답', '친절해요', '재거래 의향'].map((b) => (
            <View key={b} style={styles.tempBadge}>
              <Text style={styles.tempBadgeText}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 통계 그리드 */}
      <View style={styles.statsGrid}>
        {[
          { label: '판매내역', val: myProducts.length },
          { label: '구매내역', val: 0 },
          { label: '관심목록', val: 0 },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statCell, i > 0 && styles.statCellBorder]}>
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* 프리미엄 구독 배너 (무료 회원만) */}
      {user?.tier !== 'premium' && (
        <Pressable style={styles.premiumBanner} onPress={() => router.push('/payment')}>
          <Ionicons name="star" size={18} color={DESIGN.accent} />
          <Text style={styles.premiumBannerText}>프리미엄 구독으로 더 많은 상품 보기</Text>
          <Ionicons name="chevron-forward" size={16} color={DESIGN.accent} />
        </Pressable>
      )}

      <View style={styles.blockDivider} />

      {/* 판매 목록 미리보기 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>판매 중인 상품</Text>
        <Pressable><Text style={styles.sectionMore}>전체보기</Text></Pressable>
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
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>판매중</Text>
          </View>
        </Pressable>
      ))}

      <View style={styles.blockDivider} />

      {/* 나의 거래 섹션 */}
      <Text style={styles.menuSectionTitle}>나의 거래</Text>
      {[
        { icon: 'notifications-outline' as const, label: '구매내역' },
        { icon: 'gift-outline' as const, label: '판매내역', badge: String(myProducts.length) },
        { icon: 'heart-outline' as const, label: '관심목록' },
      ].map((item) => (
        <View key={item.label}>
          <Pressable style={styles.menuItem}>
            <Ionicons name={item.icon} size={20} color={DESIGN.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge && <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{item.badge}</Text></View>}
            <Ionicons name="chevron-forward" size={18} color="#DDD8D0" style={{ marginLeft: 'auto' }} />
          </Pressable>
          <View style={styles.menuDivider} />
        </View>
      ))}

      {/* 기타 섹션 */}
      <Text style={styles.menuSectionTitle}>기타</Text>
      {[
        { icon: 'shield-checkmark-outline' as const, label: '인증 정보' },
        { icon: 'location-outline' as const, label: '동네 인증', right: '인증 완료' },
        { icon: 'chatbubbles-outline' as const, label: '받은 매너 평가' },
        { icon: 'settings-outline' as const, label: '설정' },
      ].map((item) => (
        <View key={item.label}>
          <Pressable style={styles.menuItem}>
            <Ionicons name={item.icon} size={20} color={DESIGN.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.right && <Text style={styles.menuRight}>{item.right}</Text>}
            <Ionicons name="chevron-forward" size={18} color="#DDD8D0" style={{ marginLeft: 'auto' }} />
          </Pressable>
          <View style={styles.menuDivider} />
        </View>
      ))}

      {/* 로그아웃 */}
      <Pressable style={styles.menuItem} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FF4444" />
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.borderSubtle,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: DESIGN.textPrimary, letterSpacing: -0.5 },
  iconBtn: { padding: 6 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE9E2',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 26, fontWeight: '600', color: DESIGN.textPrimary },
  profileInfo: { flex: 1, gap: 6 },
  profileName: { fontSize: 18, fontWeight: '800', color: DESIGN.textPrimary, letterSpacing: -0.3 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: DESIGN.chipBg,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeAdmin: { backgroundColor: '#FFF0E8' },
  roleBadgeText: { fontSize: 11, color: DESIGN.textMuted, fontWeight: '600' as const },
  roleBadgeTextAdmin: { color: DESIGN.accent },
  editBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: DESIGN.textPrimary },
  tempCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: DESIGN.borderSubtle,
    borderRadius: 12,
    gap: 8,
  },
  tempCardTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  tempCardLabel: { fontSize: 13, fontWeight: '600', color: DESIGN.textSecondary },
  tempCardValue: { fontSize: 22, fontWeight: '800', color: DESIGN.accent, letterSpacing: -0.5 },
  tempBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  tempBarFill: { height: 6, backgroundColor: DESIGN.accent, borderRadius: 100 },
  tempBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tempBadge: {
    backgroundColor: DESIGN.chipBg,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tempBadgeText: { fontSize: 11, color: DESIGN.textSecondary },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN.borderSubtle,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statCell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  statCellBorder: { borderLeftWidth: 1, borderLeftColor: DESIGN.borderSubtle },
  statVal: { fontSize: 18, fontWeight: '800', color: DESIGN.textPrimary },
  statLabel: { fontSize: 12, color: DESIGN.textMuted, marginTop: 2 },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF8F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD4B8',
  },
  premiumBannerText: { flex: 1, fontSize: 14, color: DESIGN.accent, fontWeight: '600' as const },
  blockDivider: { height: 8, backgroundColor: '#f4f4f4' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DESIGN.textPrimary },
  sectionMore: { fontSize: 13, color: DESIGN.textMuted },
  myProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: DESIGN.borderDivider,
  },
  myProductThumb: { width: 64, height: 64, borderRadius: 8, flexShrink: 0 },
  myProductInfo: { flex: 1 },
  myProductTitle: { fontSize: 14, fontWeight: '500', color: DESIGN.textPrimary },
  myProductMeta: { fontSize: 12, color: DESIGN.textMuted, marginTop: 2 },
  myProductPrice: { fontSize: 14, fontWeight: '700', color: DESIGN.textPrimary, marginTop: 4 },
  statusBadge: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { fontSize: 12, color: DESIGN.textSecondary },
  menuSectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    fontSize: 12,
    fontWeight: '700',
    color: DESIGN.textMuted,
    letterSpacing: 0.3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: '500', color: DESIGN.textPrimary },
  menuRight: { fontSize: 13, color: DESIGN.textMuted },
  menuBadge: {
    backgroundColor: DESIGN.accent,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  menuDivider: {
    height: 1,
    backgroundColor: DESIGN.borderSubtle,
    marginHorizontal: 16,
  },
});

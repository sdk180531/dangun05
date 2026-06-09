import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';

const DAANGN_ORANGE = '#FF7E36';

const FEATURES = [
  { icon: 'eye-outline' as const, text: '유료 전용 상품 열람' },
  { icon: 'ribbon-outline' as const, text: '프리미엄 회원 배지' },
  { icon: 'ban-outline' as const, text: '광고 없는 깔끔한 경험' },
  { icon: 'chatbubble-ellipses-outline' as const, text: '우선 채팅 연결' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, upgradeToPremium } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    await upgradeToPremium();
    setIsProcessing(false);
    Alert.alert('구독 완료! 🎉', '프리미엄 회원이 되셨습니다.\n이제 모든 상품을 열람할 수 있어요.', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  const alreadyPremium = user?.tier === 'premium';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#212121" />
        </Pressable>
        <Text style={styles.headerTitle}>프리미엄 구독</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>
        {/* 상단 타이틀 */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🌟</Text>
          <Text style={styles.heroTitle}>당근 프리미엄</Text>
          <Text style={styles.heroSub}>더 많은 기회, 더 많은 연결</Text>

          {/* 현재 플랜 배지 */}
          <View style={[styles.currentPlanBadge, alreadyPremium && styles.currentPlanBadgePremium]}>
            <Text style={[styles.currentPlanText, alreadyPremium && styles.currentPlanTextPremium]}>
              현재 플랜: {alreadyPremium ? '✨ 프리미엄' : '무료'}
            </Text>
          </View>
        </View>

        {alreadyPremium ? (
          /* 이미 프리미엄인 경우 */
          <View style={styles.alreadyPremiumCard}>
            <Text style={styles.alreadyPremiumIcon}>🎉</Text>
            <Text style={styles.alreadyPremiumTitle}>이미 프리미엄 회원입니다!</Text>
            <Text style={styles.alreadyPremiumSub}>모든 프리미엄 혜택을 이용할 수 있어요.</Text>
          </View>
        ) : (
          <>
            {/* 플랜 카드 */}
            <View style={styles.planCard}>
              <View style={styles.planCardHeader}>
                <Text style={styles.planName}>✨ 프리미엄 플랜</Text>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceAmount}>월 9,900원</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {FEATURES.map((f) => (
                <View key={f.text} style={styles.featureRow}>
                  <View style={styles.featureCheck}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                  <Ionicons name={f.icon} size={18} color="#555" />
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            {/* 결제 수단 */}
            <View style={styles.payMethodSection}>
              <View style={styles.payMethodDividerRow}>
                <View style={styles.payMethodLine} />
                <Text style={styles.payMethodLabel}>결제 수단</Text>
                <View style={styles.payMethodLine} />
              </View>
              <View style={styles.payMethodCard}>
                <Ionicons name="card-outline" size={22} color={DAANGN_ORANGE} />
                <Text style={styles.payMethodText}>신용카드 / 체크카드</Text>
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>데모</Text>
                </View>
              </View>
            </View>

            {/* 결제 버튼 */}
            <Pressable
              style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              <Text style={styles.payBtnText}>
                {isProcessing ? '처리 중...' : '구독 시작하기'}
              </Text>
            </Pressable>

            {/* 안내 문구 */}
            <Text style={styles.disclaimer}>
              결제는 데모용이며 실제로 청구되지 않습니다.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  scroll: { paddingHorizontal: 20, paddingTop: 28 },

  heroSection: { alignItems: 'center', marginBottom: 28, gap: 8 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#212121' },
  heroSub: { fontSize: 14, color: '#888' },
  currentPlanBadge: {
    marginTop: 4,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  currentPlanBadgePremium: { backgroundColor: '#FFF0E8' },
  currentPlanText: { fontSize: 13, color: '#888', fontWeight: '600' },
  currentPlanTextPremium: { color: DAANGN_ORANGE },

  planCard: {
    borderWidth: 2,
    borderColor: DAANGN_ORANGE,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: { fontSize: 16, fontWeight: '700', color: '#212121' },
  priceBadge: {
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  priceAmount: { fontSize: 14, fontWeight: '700', color: '#fff' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DAANGN_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontSize: 14, color: '#444' },

  payMethodSection: { marginBottom: 24, gap: 14 },
  payMethodDividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payMethodLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
  payMethodLabel: { fontSize: 12, color: '#aaa' },
  payMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
  },
  payMethodText: { flex: 1, fontSize: 14, color: '#212121' },
  demoBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  demoBadgeText: { fontSize: 11, color: '#999', fontWeight: '600' },

  payBtn: {
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  payBtnDisabled: { backgroundColor: '#e0e0e0' },
  payBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  disclaimer: { fontSize: 12, color: '#bbb', textAlign: 'center' },

  alreadyPremiumCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: DAANGN_ORANGE,
    borderRadius: 14,
    backgroundColor: '#FFF8F4',
  },
  alreadyPremiumIcon: { fontSize: 48 },
  alreadyPremiumTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
  alreadyPremiumSub: { fontSize: 14, color: '#888' },
});

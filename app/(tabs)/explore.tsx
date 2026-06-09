import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const DAANGN_ORANGE = '#FF7E36';

type UserRow = {
  id: string;
  nickname: string;
  email: string;
  tier: 'free' | 'premium';
  role: string;
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('id, nickname, email, tier, role')
      .order('created_at', { ascending: false });
    if (data) setUsers(data as UserRow[]);
    setLoading(false);
  };

  const toggleTier = async (userId: string, currentTier: 'free' | 'premium') => {
    const newTier = currentTier === 'free' ? 'premium' : 'free';
    setUpdating(userId);
    const { error } = await supabase
      .from('users')
      .update({ tier: newTier })
      .eq('id', userId);
    setUpdating(null);
    if (error) {
      Alert.alert('변경 실패', error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u))
      );
    }
  };

  if (user?.role !== 'admin') {
    return (
      <View style={[styles.denied, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.deniedIcon}>🔒</Text>
        <Text style={styles.deniedTitle}>접근 권한이 없습니다</Text>
        <Text style={styles.deniedSub}>관리자만 이용할 수 있는 페이지입니다.</Text>
      </View>
    );
  }

  const premiumUsers = users.filter((u) => u.tier === 'premium');
  const freeUsers = users.filter((u) => u.tier === 'free');

  const renderUser = (u: UserRow) => (
    <View key={u.id} style={styles.userRow}>
      <View style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{u.nickname}</Text>
        <Text style={styles.userEmail}>{u.email}</Text>
      </View>
      <Pressable
        style={[styles.tierBtn, u.tier === 'premium' && styles.tierBtnPremium]}
        onPress={() => toggleTier(u.id, u.tier)}
        disabled={updating === u.id}
      >
        {updating === u.id ? (
          <ActivityIndicator size="small" color={u.tier === 'premium' ? DAANGN_ORANGE : '#555'} />
        ) : (
          <Text style={[styles.tierBtnText, u.tier === 'premium' && styles.tierBtnTextPremium]}>
            {u.tier === 'free' ? '무료→유료' : '유료→무료'}
          </Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.headerTitle}>관리자 페이지</Text>
        <Pressable onPress={fetchUsers} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>새로고침</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={DAANGN_ORANGE} size="large" />
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>유료 회원</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{premiumUsers.length}명</Text>
              </View>
            </View>
            {premiumUsers.length === 0 ? (
              <Text style={styles.empty}>유료 회원이 없습니다</Text>
            ) : (
              premiumUsers.map(renderUser)
            )}
          </View>

          <View style={styles.blockDivider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>무료 회원</Text>
              <View style={[styles.countBadge, styles.countBadgeFree]}>
                <Text style={styles.countText}>{freeUsers.length}명</Text>
              </View>
            </View>
            {freeUsers.length === 0 ? (
              <Text style={styles.empty}>무료 회원이 없습니다</Text>
            ) : (
              freeUsers.map(renderUser)
            )}
          </View>
        </>
      )}
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
  refreshBtn: { padding: 6 },
  refreshText: { fontSize: 13, color: DAANGN_ORANGE, fontWeight: '600' },
  section: { paddingVertical: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#212121' },
  countBadge: {
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countBadgeFree: { backgroundColor: '#aaa' },
  countText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  blockDivider: { height: 8, backgroundColor: '#f4f4f4' },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    flexShrink: 0,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600', color: '#212121' },
  userEmail: { fontSize: 12, color: '#999', marginTop: 2 },
  tierBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 72,
    alignItems: 'center',
  },
  tierBtnPremium: { borderColor: DAANGN_ORANGE, backgroundColor: '#FFF0E8' },
  tierBtnText: { fontSize: 12, color: '#555', fontWeight: '600' },
  tierBtnTextPremium: { color: DAANGN_ORANGE },
  empty: { fontSize: 13, color: '#bbb', paddingHorizontal: 16, paddingVertical: 12 },
  denied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 12,
  },
  deniedIcon: { fontSize: 48 },
  deniedTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
  deniedSub: { fontSize: 14, color: '#999' },
});

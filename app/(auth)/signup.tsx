import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';

const DAANGN_ORANGE = '#FF7E36';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    nickname.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSignup = async () => {
    if (isSubmitting) return;
    setError('');
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않아요');
      return;
    }
    setIsSubmitting(true);
    const err = await signup(nickname.trim(), email.trim(), password);
    setIsSubmitting(false);
    if (err) {
      setError(err);
    }
    // 성공 시 직접 navigate하지 않음
    // onAuthStateChange → setUser → (auth)/_layout.tsx의 <Redirect href="/(tabs)" /> 가 자동 처리
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#212121" />
        </Pressable>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* 닉네임 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="홍길동"
            placeholderTextColor="#bbb"
            value={nickname}
            onChangeText={(t) => { setNickname(t); setError(''); }}
            returnKeyType="next"
          />
        </View>

        {/* 이메일 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>

        {/* 비밀번호 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#bbb"
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </Pressable>
          </View>
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor="#bbb"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
              secureTextEntry={!showConfirm}
              returnKeyType="done"
              onSubmitEditing={canSubmit ? handleSignup : undefined}
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </Pressable>
          </View>
        </View>

        {/* 오류 메시지 */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 가입하기 버튼 */}
        <Pressable
          style={[styles.primaryBtn, (!canSubmit || isSubmitting) && styles.primaryBtnDisabled]}
          onPress={handleSignup}
          disabled={!canSubmit || isSubmitting}
        >
          <Text style={styles.primaryBtnText}>{isSubmitting ? '가입 중...' : '가입하기'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scroll: { paddingHorizontal: 24, paddingTop: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#212121',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#212121',
  },
  eyeBtn: { padding: 14 },
  errorText: {
    fontSize: 13,
    color: '#FF4444',
    marginBottom: 12,
    marginTop: -4,
  },
  primaryBtn: {
    backgroundColor: DAANGN_ORANGE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: { backgroundColor: '#e0e0e0' },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

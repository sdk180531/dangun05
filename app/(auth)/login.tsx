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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setError('');
    setIsLoggingIn(true);
    const err = await login(email.trim(), password);
    setIsLoggingIn(false);
    if (err) {
      setError(err);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* 로고 영역 */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>🥕</Text>
          <Text style={styles.appName}>당근마켓</Text>
          <Text style={styles.subtitle}>이메일로 로그인해요</Text>
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
              returnKeyType="done"
              onSubmitEditing={canSubmit && !isLoggingIn ? handleLogin : undefined}
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

        {/* 오류 메시지 */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 로그인 버튼 */}
        <Pressable
          style={[styles.primaryBtn, (!canSubmit || isLoggingIn) && styles.primaryBtnDisabled]}
          onPress={handleLogin}
          disabled={!canSubmit || isLoggingIn}
        >
          <Text style={styles.primaryBtnText}>{isLoggingIn ? '로그인 중...' : '로그인하기'}</Text>
        </Pressable>

        {/* 구분선 */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 회원가입 버튼 */}
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.secondaryBtnText}>회원가입하기</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24 },
  logoArea: { alignItems: 'center', marginBottom: 48 },
  logoEmoji: { fontSize: 56, marginBottom: 12 },
  appName: { fontSize: 26, fontWeight: '800', color: DAANGN_ORANGE, marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#555' },
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#e0e0e0' },
  dividerText: { fontSize: 13, color: '#bbb' },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#555' },
});

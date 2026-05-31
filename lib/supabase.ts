import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// URL 폴리필: 웹은 이미 URL 전역이 있으므로 네이티브에서만 적용
if (Platform.OS !== 'web') {
  require('react-native-url-polyfill/auto');
}

// 플랫폼별 스토리지
// - 웹: undefined → Supabase가 브라우저 localStorage 자동 사용
// - 네이티브(iOS/Android): AsyncStorage로 세션 영구 저장
const storage =
  Platform.OS !== 'web'
    ? require('@react-native-async-storage/async-storage').default
    : undefined;

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      ...(storage !== undefined && { storage }),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

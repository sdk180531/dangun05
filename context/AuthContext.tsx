import { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '@/lib/supabase';

export type User = {
  id: string;
  nickname: string;
  email: string;
  avatar_url: string | null;
  provider: string;
  tier: 'free' | 'premium';
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  loginWithGoogle: () => Promise<string | null>;
  signup: (nickname: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let initialized = false;

    // 인증 상태 변경 감지 (앱 시작 시 세션 복원 포함)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // profiles 테이블에서 닉네임·이메일·avatar_url·tier·role 조회
          const { data } = await supabase
            .from('profiles')
            .select('id, nickname, email, avatar_url, provider, tier, role')
            .eq('id', session.user.id)
            .single();
          if (data) {
            setUser({
              id: data.id,
              nickname: data.nickname,
              email: data.email,
              avatar_url: data.avatar_url ?? null,
              provider: data.provider,
              tier: data.tier,
              role: data.role,
            });
          } else {
            // profiles 행이 없을 때 fallback: session.user 데이터 직접 사용
            setUser({
              id: session.user.id,
              nickname: (session.user.user_metadata?.nickname as string)
                ?? (session.user.user_metadata?.full_name as string)
                ?? '사용자',
              email: session.user.email ?? '',
              avatar_url: (session.user.user_metadata?.avatar_url as string) ?? null,
              provider: (session.user.app_metadata?.provider as string) ?? 'email',
              tier: 'free',
              role: 'user',
            });
          }
        } else {
          setUser(null);
        }
        // 최초 1회만 isLoading 해제
        if (!initialized) {
          initialized = true;
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (
    nickname: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }, // DB 트리거에서 raw_user_meta_data->>'nickname'으로 읽음
      },
    });
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        return '이미 사용 중인 이메일이에요';
      }
      return '회원가입에 실패했어요. 다시 시도해주세요.';
    }
    return null;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return '이메일 또는 비밀번호가 틀렸어요';
    return null;
  };

  const loginWithGoogle = async (): Promise<string | null> => {
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: '20260515',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });

    if (error || !data.url) return '구글 로그인을 시작할 수 없어요';

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success') return null;

    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (code) {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      return sessionError ? '구글 로그인 인증에 실패했어요' : null;
    }

    const params = new URLSearchParams(url.hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? '',
      });
      return sessionError ? '구글 로그인 인증에 실패했어요' : null;
    }

    return '구글 로그인이 완료되지 않았어요';
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const upgradeToPremium = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ tier: 'premium' })
      .eq('id', user.id);
    if (!error) {
      setUser((prev) => prev ? { ...prev, tier: 'premium' } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signup, logout, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

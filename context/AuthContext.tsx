import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type User = {
  id: string;
  nickname: string;
  email: string;
  tier: 'free' | 'premium';
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
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
          // users 테이블에서 닉네임·이메일·tier·role 조회
          const { data } = await supabase
            .from('users')
            .select('id, nickname, email, tier, role')
            .eq('id', session.user.id)
            .single();
          if (data) {
            setUser({
              id: data.id,
              nickname: data.nickname,
              email: data.email,
              tier: data.tier,
              role: data.role,
            });
          } else {
            // users 행이 없을 때 fallback: session.user 데이터 직접 사용
            setUser({
              id: session.user.id,
              nickname: (session.user.user_metadata?.nickname as string) ?? '사용자',
              email: session.user.email ?? '',
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

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const upgradeToPremium = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .update({ tier: 'premium' })
      .eq('id', user.id);
    if (!error) {
      setUser((prev) => prev ? { ...prev, tier: 'premium' } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

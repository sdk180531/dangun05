-- ============================================================
-- Supabase Dashboard > SQL Editor > New query 에서 실행
-- ============================================================

-- 1. profiles 테이블 생성 (이미 존재하면 건너뜀)
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  nickname   text not null default '사용자',
  email      text,
  avatar_url text,
  provider   text not null default 'email',
  tier       text not null default 'free' check (tier in ('free', 'premium')),
  role       text not null default 'user'  check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- 테이블이 이미 존재하는 경우 provider 컬럼 추가
alter table public.profiles
  add column if not exists provider text not null default 'email';

-- 2. RLS 활성화
alter table public.profiles enable row level security;

-- 3. RLS 정책: 본인 프로필만 조회/수정 허용 (기존 정책 삭제 후 재생성)
drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. 신규 가입 시 profiles 자동 생성 트리거 (이메일 + Google 모든 provider 지원)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, email, avatar_url, provider)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nickname',   -- 이메일 가입
      new.raw_user_meta_data->>'full_name',  -- Google OAuth
      new.raw_user_meta_data->>'name',       -- 기타 provider
      split_part(new.email, '@', 1)          -- fallback: 이메일 앞부분
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url',   -- Google 프로필 사진 URL
    coalesce(new.raw_app_meta_data->>'provider', 'email')  -- 'email' | 'google' | ...
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. 기존 users 테이블 데이터 마이그레이션 (있을 경우 실행)
-- insert into public.profiles (id, nickname, email, tier, role)
-- select id, nickname, email, tier, role from public.users
-- on conflict (id) do nothing;

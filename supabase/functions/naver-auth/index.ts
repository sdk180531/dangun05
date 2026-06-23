const APP_SCHEME = 'kwangjumarket://auth/callback';

async function getSupabaseSession(
  naverAccessToken: string,
  supabaseUrl: string,
  serviceKey: string,
  anonKey: string,
  salt: string,
) {
  // 1. Naver 프로필 조회
  const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${naverAccessToken}` },
  });
  const profileData = await profileRes.json();
  const { id: naverId, email, name, profile_image } = profileData.response ?? {};

  if (!email) throw new Error('no_email');

  // 2. HMAC-SHA256(naverId, SALT) → 결정적 패스워드
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(naverId));
  const password = btoa(String.fromCharCode(...new Uint8Array(sig)));

  // 3. Supabase admin 클라이언트로 유저 조회/생성
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existingUser = listData?.users?.find((u) => u.email === email);

  if (existingUser) {
    await admin.auth.admin.updateUserById(existingUser.id, {
      user_metadata: { full_name: name, avatar_url: profile_image, provider: 'naver' },
    });
  } else {
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, avatar_url: profile_image, provider: 'naver' },
    });
    if (createError) throw new Error(createError.message);
  }

  // 4. 세션 발급
  const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: sessionData, error: sessionError } = await anonClient.auth.signInWithPassword({
    email,
    password,
  });

  if (sessionError || !sessionData.session) throw new Error('session_failed');
  return sessionData.session;
}

Deno.serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  const SALT = Deno.env.get('NAVER_SALT')!;

  // POST: 네이티브 SDK 플로우 (access_token 직접 전달)
  if (req.method === 'POST') {
    try {
      const { naver_access_token } = await req.json();
      if (!naver_access_token) {
        return new Response(JSON.stringify({ error: 'missing_token' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const session = await getSupabaseSession(naver_access_token, SUPABASE_URL, SERVICE_KEY, ANON_KEY, SALT);

      return new Response(
        JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // GET: OAuth 웹 콜백 플로우 (code → token 교환)
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const naverError = url.searchParams.get('error');

  if (naverError) {
    return Response.redirect(`${APP_SCHEME}?error=${encodeURIComponent(naverError)}`, 302);
  }

  if (!code) {
    return new Response('Bad Request: missing code', { status: 400 });
  }

  try {
    const CLIENT_ID = Deno.env.get('NAVER_CLIENT_ID')!;
    const CLIENT_SECRET = Deno.env.get('NAVER_CLIENT_SECRET')!;
    const EDGE_FN_URL = 'https://itvhgyjgujiijapjnayw.supabase.co/functions/v1/naver-auth';

    // Naver 인증 코드 → 액세스 토큰
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: EDGE_FN_URL,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return Response.redirect(`${APP_SCHEME}?error=token_exchange_failed`, 302);
    }

    const session = await getSupabaseSession(tokenData.access_token, SUPABASE_URL, SERVICE_KEY, ANON_KEY, SALT);

    const appUrl =
      `${APP_SCHEME}` +
      `?access_token=${encodeURIComponent(session.access_token)}` +
      `&refresh_token=${encodeURIComponent(session.refresh_token)}`;

    return Response.redirect(appUrl, 302);
  } catch (err) {
    return Response.redirect(`${APP_SCHEME}?error=${encodeURIComponent(String(err))}`, 302);
  }
});

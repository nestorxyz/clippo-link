import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/integrations/supabase/server';

export async function GET(request: Request) {
  console.log('Auth Callback Route Hit:', request.url);
  const { searchParams, origin } = new URL(request.url);
  const access_token = searchParams.get('access_token');
  const provider_token = searchParams.get('provider_token');
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }

  console.log('Access Token:', access_token);
  console.log('Provider Token:', provider_token);

  if (access_token && provider_token) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      access_token,
      token: provider_token,
    });
    console.log('Supabase Auth Data:', data);
    console.log('Supabase Auth Error:', error);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

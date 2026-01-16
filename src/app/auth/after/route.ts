import { NextResponse } from 'next/server';
import { createClient } from '@/integrations/retired-provider/server';

const LEMON_MONTHLY =
  'https://misfitlabs.lemonsqueezy.com/buy/a1200a99-d915-43a1-94c7-26ccace2382d';
const LEMON_ANNUAL =
  'https://misfitlabs.lemonsqueezy.com/buy/a9367717-b49e-4255-b831-541b9c63fdd2';
const DISCOUNT = 'BETALAUNCH';

function buildCheckoutUrl(base: string, email?: string | null) {
  try {
    const url = new URL(base);
    if (email) url.searchParams.set('checkout[email]', email);
    url.searchParams.set('checkout[discount_code]', DISCOUNT);
    return url.toString();
  } catch {
    const sep = base.includes('?') ? '&' : '?';
    const q = new URLSearchParams();
    if (email) q.set('checkout[email]', email);
    q.set('checkout[discount_code]', DISCOUNT);
    return `${base}${sep}${q.toString()}`;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const plan = searchParams.get('plan');
  const intent = searchParams.get('intent');

  const retired-provider = await createClient();
  const {
    data: { user },
  } = await retired-provider.auth.getUser();

  if (!user) {
    const qs = searchParams.toString();
    return NextResponse.redirect(`${origin}/sign-in${qs ? `?${qs}` : ''}`);
  }

  if (intent !== 'checkout' || (plan !== 'monthly' && plan !== 'annual')) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const base = plan === 'annual' ? LEMON_ANNUAL : LEMON_MONTHLY;
  const dest = buildCheckoutUrl(base, user.email);
  return NextResponse.redirect(dest);
}

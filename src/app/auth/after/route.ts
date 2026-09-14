import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import {
  buildLegacyCheckoutUrl,
  isLegacyBillingPlan,
} from '@/server/billing/legacy-lemon-checkout';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const plan = searchParams.get('plan');
  const intent = searchParams.get('intent');

  const user = await currentUser();

  if (!user) {
    const afterUrl = `/auth/after?plan=${plan}&intent=${intent}`;
    const signInUrl = new URL(`${origin}/sign-in`);
    signInUrl.searchParams.set('redirect_url', afterUrl);
    return NextResponse.redirect(signInUrl.toString());
  }

  if (intent !== 'checkout' || !isLegacyBillingPlan(plan)) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const dest = buildLegacyCheckoutUrl(plan, email);
  return NextResponse.redirect(dest);
}

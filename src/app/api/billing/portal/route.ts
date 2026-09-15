import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  createPolarPortalUrl,
  usesPolarBilling,
} from '@/server/billing/polar';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const user = await currentUser();

  if (!user) {
    const signInUrl = new URL(`${origin}/sign-in`);
    signInUrl.searchParams.set('redirect_url', '/api/billing/portal');
    return NextResponse.redirect(signInUrl);
  }

  if (!usesPolarBilling()) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  try {
    const portalUrl = await createPolarPortalUrl({
      clerkUserId: user.id,
      origin,
    });
    return NextResponse.redirect(portalUrl);
  } catch (error) {
    console.error('Unable to create Polar customer portal session', error);
    return NextResponse.json(
      { error: 'BILLING_PORTAL_UNAVAILABLE' },
      { status: 503 },
    );
  }
}

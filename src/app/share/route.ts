import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { extractSharedHttpUrl } from '@/lib/share-target';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const sharedUrl = extractSharedHttpUrl(
    requestUrl.searchParams.get('url'),
    requestUrl.searchParams.get('text'),
  );
  const dashboardPath = sharedUrl
    ? `/dashboard?shared_url=${encodeURIComponent(sharedUrl)}`
    : '/dashboard?share_error=missing_url';
  const { userId } = await auth();

  if (userId) {
    return NextResponse.redirect(new URL(dashboardPath, requestUrl.origin));
  }

  const signInUrl = new URL('/sign-in', requestUrl.origin);
  signInUrl.searchParams.set('redirect_url', dashboardPath);
  return NextResponse.redirect(signInUrl);
}

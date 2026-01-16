'use client';

import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { env } from '@/env';

const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

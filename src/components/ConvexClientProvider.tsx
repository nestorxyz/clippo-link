'use client';

import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
console.log('ConvexClientProvider: URL:', convexUrl);

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log('ConvexClientProvider: Rendering');
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

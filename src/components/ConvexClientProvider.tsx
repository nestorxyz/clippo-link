'use client';

import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
console.log('ConvexClientProvider: URL:', convexUrl);

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log('ConvexClientProvider: Rendering');
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}

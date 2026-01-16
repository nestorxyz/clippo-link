/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/providers';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DoryAI',
  description: 'Your clipboard manager app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <ConvexClientProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ConvexClientProvider>
            <Toaster />
            <Sonner />
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

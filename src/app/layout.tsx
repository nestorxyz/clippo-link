import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/providers';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { siteConfig } from '@/lib/site-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: 'DoryAI — Save and find useful links',
  description:
    'Save useful webpages and social links through chat, let DoryAI organize them, and find them later in your own words.',
  applicationName: 'DoryAI',
  openGraph: {
    type: 'website',
    siteName: 'DoryAI',
    title: 'DoryAI — Save and find useful links',
    description:
      'Save useful webpages and social links through chat, then find them later in your own words.',
    images: [
      {
        url: '/product.png',
        width: 3014,
        height: 1572,
        alt: 'DoryAI link library and chat interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoryAI — Save and find useful links',
    description:
      'Save useful webpages and social links through chat, then find them later in your own words.',
    images: ['/product.png'],
  },
  robots: {
    index: siteConfig.indexable,
    follow: siteConfig.indexable,
  },
};

import { UserProvider } from '@/context/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <ConvexClientProvider>
              <UserProvider>
                <TooltipProvider>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </TooltipProvider>
              </UserProvider>
            </ConvexClientProvider>
            <Sonner />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

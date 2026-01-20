import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/providers';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <ConvexClientProvider>
              <TooltipProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </TooltipProvider>
            </ConvexClientProvider>
            <Sonner />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#0F0F0F]">{children}</div>;
}

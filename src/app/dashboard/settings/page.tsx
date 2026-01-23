'use client';

import { AccountForm } from '@/components/AccountForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg relative">
        <Link href="/dashboard" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Your Account
          </h2>
        </div>
        <AccountForm />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AccountForm } from '@/components/AccountForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retired-provider.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = retired-provider.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      redirect('/sign-in');
    }
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

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
        <AccountForm session={session} />
      </div>
    </div>
  );
}

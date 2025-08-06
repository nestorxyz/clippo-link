'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && session) {
      redirect('/dashboard');
    }
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background text-center p-4 sm:p-8 relative">
      <header className="absolute top-8">
        <Link
          href="/"
          className="text-lg font-bold flex items-center gap-2 text-foreground"
        >
          <Bookmark className="w-6 h-6" />
          <span>Clippo</span>
        </Link>
      </header>

      <main className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Get started
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in or create an account to get started.
        </p>
        <div className="mt-8">
          <AuthForm />
        </div>
      </main>

      <footer className="absolute bottom-8 text-xs text-muted-foreground max-w-md">
        <p>
          By proceeding, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and acknowledge that our{' '}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>{' '}
          applies to you.
        </p>
      </footer>
    </div>
  );
}

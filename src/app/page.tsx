'use client';

import { useEffect, useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ValuePropositionSection from '@/components/landing/ValuePropositionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import AudienceSection from '@/components/landing/AudienceSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retired-provider.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const subscription = retired-provider.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.data.subscription.unsubscribe();
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
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <ValuePropositionSection />
        <FeaturesSection id="features" />
        <UseCasesSection />
        <AudienceSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import Management from '@/components/Management';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import BottomNavbar from '@/components/BottomNavbar';
import Header from '@/components/Header';
import { PhoneVerification } from '@/components/PhoneVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';

type ActiveView = 'columns' | 'chat' | 'settings';

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError,
    error,
    refetch,
  } = useCategories(session);
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const {
    phoneStatus,
    needsPhoneVerification,
    refresh: refreshPhoneStatus,
  } = usePhoneVerification();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

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
    if (!loading && !session) {
      redirect('/auth');
    }
  }, [session, loading]);

  useEffect(() => {
    // Show phone verification modal if needed
    if (needsPhoneVerification && !showPhoneVerification) {
      setShowPhoneVerification(true);
    }
  }, [needsPhoneVerification, showPhoneVerification]);

  useEffect(() => {
    if (!session?.user.id) return;
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clips',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['clips'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, queryClient]);

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

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground max-w-md">
          {error?.message || 'Failed to load your data. Please try again.'}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      {showPhoneVerification && (
        <PhoneVerification
          isOpen={showPhoneVerification}
          onVerified={() => {
            setShowPhoneVerification(false);
            refreshPhoneStatus();
          }}
          onClose={() => setShowPhoneVerification(false)}
        />
      )}

      <div className="flex h-screen bg-background">
        {!isMobile && (
          <Sidebar
            categories={categories}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
            session={session}
          />
        )}

        <div
          className={cn(
            'flex-1 flex flex-col',
            !isMobile && 'transition-all duration-300'
          )}
        >
          {!isMobile && <Header session={session} />}

          <main className="flex-1 overflow-hidden">
            {activeView === 'chat' && (
              <Chat
                session={session}
                categories={categories}
                onLinkAdded={refetch}
              />
            )}
            {activeView === 'columns' && <Management session={session} />}
          </main>

          {isMobile && (
            <BottomNavbar
              activeView={activeView}
              setActiveView={setActiveView}
            />
          )}
        </div>
      </div>
    </>
  );
}

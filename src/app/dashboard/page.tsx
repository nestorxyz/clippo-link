'use client';

import { useEffect, useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import LeftNav from '@/components/LeftNav';
import RightPreviewSidebar from '@/components/RightPreviewSidebar';
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
import SettingsModal from '@/components/SettingsModal';
import { PhoneVerification } from '@/components/PhoneVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';

type ActiveView = 'columns' | 'chat' | 'settings';

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
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
  // Track if the user dismissed the phone verification prompt (per session)
  const [dismissedPhoneVerification, setDismissedPhoneVerification] =
    useState<boolean>(() => {
      if (typeof window === 'undefined') return false;
      try {
        return sessionStorage.getItem('dismissed_phone_verification') === '1';
      } catch {
        return false;
      }
    });
  const [showSettings, setShowSettings] = useState(false);

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
    const open = () => setShowSettings(true);
    const closeOnRoute = () => setShowSettings(false);
    window.addEventListener('open-settings', open as EventListener);
    return () => {
      window.removeEventListener('open-settings', open as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      redirect('/login');
    }
  }, [session, loading]);

  useEffect(() => {
    // Show phone verification modal if needed and not previously dismissed this session
    if (needsPhoneVerification && !dismissedPhoneVerification) {
      setShowPhoneVerification(true);
    }
  }, [needsPhoneVerification, dismissedPhoneVerification]);

  useEffect(() => {
    if (!session?.user.id) return;
    const channel = retired-provider
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
      retired-provider.removeChannel(channel);
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
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        session={session}
      />
      {showPhoneVerification && (
        <PhoneVerification
          isOpen={showPhoneVerification}
          onVerified={() => {
            setShowPhoneVerification(false);
            setDismissedPhoneVerification(true);
            try {
              sessionStorage.setItem('dismissed_phone_verification', '1');
            } catch {
              // ignore storage errors
            }
            refreshPhoneStatus();
          }}
          onClose={() => {
            setShowPhoneVerification(false);
            setDismissedPhoneVerification(true);
            try {
              sessionStorage.setItem('dismissed_phone_verification', '1');
            } catch {
              // ignore storage errors
            }
          }}
        />
      )}

      <div className="flex h-screen">
        {!isMobile && (
          <LeftNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            selectedSubCategoryId={selectedSubCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
            onSelectSubCategory={(subId, catId) => {
              setSelectedSubCategoryId(subId);
              setSelectedCategoryId(catId);
            }}
            session={session}
          />
        )}

        {!isMobile && (
          <RightPreviewSidebar
            categories={categories}
            selectedSubCategoryId={selectedSubCategoryId}
          />
        )}

        <div
          className={cn(
            'flex-1 flex flex-col bg-[#111111] border border-[#1D1D1D] m-2 rounded-sm overflow-hidden',
            !isMobile && 'transition-all duration-300'
          )}
        >
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

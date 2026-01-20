'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import LeftNav from './_components/LeftNav';
import RightPreviewSidebar from '@/components/RightPreviewSidebar';
import Chat from '@/components/Chat';
import { useCategories } from '@/hooks/useCategories';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import BottomNavbar from '@/components/BottomNavbar';
import SettingsModal from '@/components/SettingsModal';
import { PhoneVerification } from '@/components/PhoneVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import PricingModal from '@/components/PricingModal';
import MobileHeader from '@/components/MobileHeader';
import LinksGrid from '@/components/LinksGrid';
import { useConvexAuth } from 'convex/react';

type ActiveView = 'links' | 'chat';

export default function DashboardPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  // useCategories now returns simple data
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  console.log('categories', categories);

  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [viewMode, setViewMode] = useState<
    'inbox' | 'favorites' | 'read-later' | 'category'
  >('inbox');
  const { needsPhoneVerification, refresh: refreshPhoneStatus } =
    usePhoneVerification();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const [dismissedPhoneVerification, setDismissedPhoneVerification] =
    useState<boolean>(() => {
      if (typeof window === 'undefined') return false;
      try {
        return sessionStorage.getItem('dismissed_phone_verification') === '1';
      } catch {
        return false;
      }
    });
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const openPricing = () => setShowPricing(true);
    window.addEventListener('open-pricing', openPricing as EventListener);
    return () => {
      window.removeEventListener('open-pricing', openPricing as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/sign-in');
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (needsPhoneVerification && !dismissedPhoneVerification) {
      setShowPhoneVerification(true);
    }
  }, [needsPhoneVerification, dismissedPhoneVerification]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SettingsModal />
      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
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

      <div className="flex h-screen flex-col md:flex-row">
        {!isMobile && (
          <LeftNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            selectedSubCategoryId={selectedSubCategoryId}
            viewMode={viewMode}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setViewMode('category');
            }}
            onSelectSubCategory={(subId, catId) => {
              setSelectedSubCategoryId(subId);
              setSelectedCategoryId(catId);
              setViewMode('category');
            }}
            onViewChange={(mode) => {
              setViewMode(mode);
              if (mode !== 'category') {
                setSelectedCategoryId(null);
                setSelectedSubCategoryId(null);
              }
            }}
          />
        )}

        {!isMobile && (
          <RightPreviewSidebar
            categories={categories}
            selectedSubCategoryId={selectedSubCategoryId}
            viewMode={viewMode}
          />
        )}

        {isMobile && <MobileHeader />}

        <div
          className={cn(
            'flex-1 flex flex-col bg-[#111111] border border-[#1D1D1D] m-2 rounded-sm overflow-hidden',
            !isMobile && 'transition-all duration-300',
          )}
        >
          <main className="flex-1 overflow-hidden">
            {activeView === 'chat' && (
              <Chat
                categories={categories}
                onLinkAdded={() => {
                  // Convex queries auto-update, no manual refetch needed usually.
                  // If Chat needs to trigger something, it can, but useCategories updates automatically.
                }}
              />
            )}
            {activeView === 'links' && (
              <div className="h-full overflow-y-auto">
                <LinksGrid
                  categories={categories}
                  selectedSubCategoryId={selectedSubCategoryId}
                />
              </div>
            )}
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

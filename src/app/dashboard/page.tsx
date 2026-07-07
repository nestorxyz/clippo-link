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
import PricingModal from '@/components/PricingModal';
import MobileHeader from '@/components/MobileHeader';
import LinksGrid from './_components/LinksGrid';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

type ActiveView = 'links' | 'chat';

export default function DashboardPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.current);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  // useCategories now returns simple data
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [viewMode, setViewMode] = useState<
    'inbox' | 'favorites' | 'read-later' | 'category'
  >('inbox');
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

  if (isLoading || isLoadingCategories || currentUser === undefined) {
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
            'flex-1 flex flex-col bg-[#111111] border border-[#1D1D1D] rounded-sm overflow-hidden mx-2 mt-2',
            isMobile
              ? 'mb-[calc(4rem+env(safe-area-inset-bottom)+0.5rem)]'
              : 'mb-2 transition-all duration-300',
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

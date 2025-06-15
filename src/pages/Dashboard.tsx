
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import Management from '@/components/Management';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import BottomNavbar from '@/components/BottomNavbar';
import Header from '@/components/Header';

type ActiveView = 'columns' | 'chat' | 'settings';

const DashboardPage = ({ session }: { session: Session | null }) => {
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories, isError, error, refetch } = useCategories(session);
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ActiveView>('chat');

  useEffect(() => {
    if (!session?.user.id) return;

    const channel = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Realtime change received!', payload);
        queryClient.invalidateQueries({ queryKey: ['categories', session.user.id] });
        queryClient.invalidateQueries({ queryKey: ['tags', session.user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);


  const onLinkAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['categories', session?.user.id] });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-center p-4">
        <AlertTriangle className="h-12 w-12 mb-4 text-destructive" />
        <h2 className="text-xl font-semibold mb-2">Failed to Load Data</h2>
        <p className="mb-4 text-muted-foreground">
          There was a problem fetching your information. Please try again.
        </p>
        {error instanceof Error && (
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            <span className="font-semibold">Details:</span> {error.message}
          </p>
        )}
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full bg-background font-sans">
        <main className="flex-1 overflow-y-auto pb-16">
          {activeView === 'columns' && (
            <Sidebar
              categories={categories}
              isCollapsed={false}
              toggleSidebar={() => {}}
              session={session}
              isMobile={true}
            />
          )}
          {activeView === 'chat' && (
            <Chat categories={categories} session={session} onLinkAdded={onLinkAdded} />
          )}
          {activeView === 'settings' && <Management session={session} />}
        </main>
        <BottomNavbar activeView={activeView} setActiveView={setActiveView} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background font-sans">
      <Header session={session} />
      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        <div
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-20" : "w-1/4"
          )}
        >
          <Sidebar
            categories={categories}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            session={session}
          />
        </div>
        <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
          <Chat categories={categories} session={session} onLinkAdded={onLinkAdded} />
        </div>
        <aside className="w-1/4 rounded-lg border bg-card text-card-foreground shadow-sm flex-col overflow-hidden hidden lg:flex">
          <Management session={session} />
        </aside>
      </main>
    </div>
  );
};

export default DashboardPage;

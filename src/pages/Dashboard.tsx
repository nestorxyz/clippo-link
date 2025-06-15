
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

const DashboardPage = ({ session }: { session: Session | null }) => {
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories, isError, error, refetch } = useCategories(session);

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

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <Sidebar categories={categories} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} session={session} />
      <main className="flex-1 flex flex-col h-screen border-l border-r">
        <Management session={session} />
      </main>
      <aside className="w-[500px] flex-shrink-0 flex flex-col h-screen bg-card/40 border-l">
        <Chat categories={categories} session={session} onLinkAdded={onLinkAdded} />
      </aside>
    </div>
  );
};

export default DashboardPage;

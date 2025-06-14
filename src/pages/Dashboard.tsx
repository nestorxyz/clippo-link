import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { Category } from '@/lib/types';
import { useState } from 'react';
import { Session } from '@retired-provider/retired-provider-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const transformDataToCategories = (data: any[] | null): Category[] => {
  if (!data) return [];
  return data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    subCategories: category.sub_categories ? category.sub_categories.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      links: sub.links ? sub.links.map((link: any) => ({
        id: link.id,
        url: link.url,
        description: link.description,
        createdAt: link.created_at,
        tags: sub.links ? sub.links.map((lt: any) => lt.tags).filter(Boolean) : [],
      })) : [],
    })) : [],
  }));
};

const DashboardPage = ({ session }: { session: Session | null }) => {
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: categoriesData, isLoading: isLoadingCategories, isError, error, refetch } = useQuery({
    queryKey: ['categories', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await retired-provider
        .from('categories')
        .select(`
          id,
          name,
          description,
          sub_categories (
            id,
            name,
            description,
            links (
              id,
              url,
              description,
              created_at,
              link_tags (
                tags (
                  id,
                  name,
                  color
                )
              )
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .order('created_at', { foreignTable: 'sub_categories', ascending: true })
        .order('created_at', { foreignTable: 'sub_categories.links', ascending: true });


      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!session?.user.id,
    retry: false,
  });
  
  const categories = transformDataToCategories(categoriesData);

  const onLinkAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['categories', session?.user.id] });
    // The toast notification is now triggered by the AI's response,
    // but we can leave this here for other potential uses or remove if not needed.
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
      <main className="flex-1 flex flex-col h-screen">
        <Chat categories={categories} session={session} onLinkAdded={onLinkAdded} />
      </main>
    </div>
  );
};

export default DashboardPage;

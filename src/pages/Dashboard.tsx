
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { Category } from '@/lib/types';
import { useState } from 'react';
import { Session } from '@retired-provider/retired-provider-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
              created_at
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

  const addLinkMutation = useMutation({
    mutationFn: async ({ categoryName, subCategoryName, url, description }: { categoryName: string, subCategoryName: string, url: string, description: string }) => {
      if (!session?.user.id) throw new Error("User not logged in");

      const trimmedCategoryName = categoryName.trim();
      const trimmedSubCategoryName = subCategoryName.trim();

      // Find or create category
      let { data: category, error: catError } = await retired-provider
        .from('categories')
        .select('id')
        .eq('user_id', session.user.id)
        .ilike('name', trimmedCategoryName)
        .maybeSingle();

      if (catError) throw catError;

      if (!category) {
        const { data: newCategory, error: newCatError } = await retired-provider
          .from('categories')
          .insert({ name: trimmedCategoryName, user_id: session.user.id })
          .select('id')
          .single();
        if (newCatError) throw newCatError;
        category = newCategory;
      }
      
      // Find or create sub-category
      let { data: subCategory, error: subCatError } = await retired-provider
        .from('sub_categories')
        .select('id')
        .eq('category_id', category.id)
        .ilike('name', trimmedSubCategoryName)
        .maybeSingle();

      if (subCatError) throw subCatError;

      if (!subCategory) {
        const { data: newSubCategory, error: newSubCatError } = await retired-provider
          .from('sub_categories')
          .insert({ name: trimmedSubCategoryName, category_id: category.id })
          .select('id')
          .single();
        if (newSubCatError) throw newSubCatError;
        subCategory = newSubCategory;
      }

      // Insert link
      const { error: linkError } = await retired-provider.from('links').insert({
        url,
        description,
        sub_category_id: subCategory.id,
        user_id: session.user.id,
      });

      if (linkError) throw linkError;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Link added successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to add link", { description: error.message });
    }
  });

  const addLink = async (categoryName: string, subCategoryName: string, url: string, description: string): Promise<boolean> => {
     if (!categoryName?.trim() || !subCategoryName?.trim()) {
        toast.error("Invalid input", { description: "Category and subcategory names must be provided in 'Category/Subcategory' format." });
        return false;
    }
    try {
      await addLinkMutation.mutateAsync({ categoryName, subCategoryName, url, description });
      return true;
    } catch (e) {
      return false;
    }
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
        <Chat addLink={addLink} categories={categories} />
      </main>
    </div>
  );
};

export default DashboardPage;

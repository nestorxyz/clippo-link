
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { Category } from '@/lib/types';
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
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
        toast.error('Failed to fetch categories', { description: error.message });
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!session?.user.id,
  });
  
  const categories = transformDataToCategories(categoriesData);

  const addLinkMutation = useMutation({
    mutationFn: async ({ categoryName, subCategoryName, url, description }: { categoryName: string, subCategoryName: string, url: string, description: string }) => {
      if (!session?.user.id) throw new Error("User not logged in");

      const trimmedCategoryName = categoryName.trim();
      const trimmedSubCategoryName = subCategoryName.trim();

      // Find or create category
      let { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', session.user.id)
        .ilike('name', trimmedCategoryName)
        .maybeSingle();

      if (catError) throw catError;

      if (!category) {
        const { data: newCategory, error: newCatError } = await supabase
          .from('categories')
          .insert({ name: trimmedCategoryName, user_id: session.user.id })
          .select('id')
          .single();
        if (newCatError) throw newCatError;
        category = newCategory;
      }
      
      // Find or create sub-category
      let { data: subCategory, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id')
        .eq('category_id', category.id)
        .ilike('name', trimmedSubCategoryName)
        .maybeSingle();

      if (subCatError) throw subCatError;

      if (!subCategory) {
        const { data: newSubCategory, error: newSubCatError } = await supabase
          .from('sub_categories')
          .insert({ name: trimmedSubCategoryName, category_id: category.id })
          .select('id')
          .single();
        if (newSubCatError) throw newSubCatError;
        subCategory = newSubCategory;
      }

      // Insert link
      const { error: linkError } = await supabase.from('links').insert({
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


import { useQuery } from '@tanstack/react-query';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Category } from '@/lib/types';
import { Session } from '@retired-provider/retired-provider-js';

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
        tags: link.link_tags ? link.link_tags.map((lt: any) => lt.tags).filter(Boolean) : [],
      })) : [],
    })) : [],
  }));
};

export const useCategories = (session: Session | null) => {
  return useQuery({
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
    select: transformDataToCategories,
    enabled: !!session?.user.id,
    retry: false,
  });
};

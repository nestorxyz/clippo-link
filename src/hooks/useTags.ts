
import { useQuery } from '@tanstack/react-query';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Tag } from '@/lib/types';
import { Session } from '@retired-provider/retired-provider-js';

export const useTags = (session: Session | null) => {
  return useQuery({
    queryKey: ['tags', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return [];
      const { data, error } = await retired-provider
        .from('tags')
        .select('id, name, color')
        .eq('user_id', session.user.id)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data as Tag[];
    },
    enabled: !!session?.user.id,
  });
};

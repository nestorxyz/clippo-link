import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const useCategories = () => {
  const data = useQuery(api.categories.get);
  return { data: data ?? [], isLoading: data === undefined };
};

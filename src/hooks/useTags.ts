import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const useTags = () => {
  const data = useQuery(api.tags.get);
  return { data, isLoading: data === undefined };
};

import { useUserContext } from '@/context/UserContext';
import { UserPlan } from '../../convex/billing';

export type { UserPlan };

export function usePlan() {
  const { plan, isLoading } = useUserContext();

  // If we want to maintain the exact same API:
  return {
    data: plan || null,
    isLoading: isLoading,
    error: null, // Context doesn't currently expose error, assuming Convex handles it or we add it later
    refetch: async () => {}, // No-op for now, or we could expose a way to retry the query
  } as const;
}

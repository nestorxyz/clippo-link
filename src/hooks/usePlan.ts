import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { env } from '@/env';

export type UserPlan = {
  plan: 'free' | 'premium';
  status: string | null;
  limit: number;
  period: { start: string; end: string };
  used: number;
  remaining: number;
  subscriptionId?: string;
  variantId?: string | null;
  managePortalUrl?: string | null;
  renewsAt?: string;
  trialEndsAt?: string | null;
};

export function usePlan() {
  const [data, setData] = useState<UserPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const fetchPlan = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken({ template: 'convex' });
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_URL}/api/billing/plan`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed to load plan (${res.status})`);
      const json = await res.json();
      setData(json.data as UserPlan);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error('Failed to load plan'));
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchPlan();
    }
  }, [fetchPlan, isLoaded, isSignedIn]);

  return { data, isLoading, error, refetch: fetchPlan } as const;
}

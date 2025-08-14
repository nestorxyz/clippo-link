import { useCallback, useEffect, useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
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

  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: sessionRes } = await retired-provider.auth.getSession();
      const token = sessionRes.session?.access_token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/billing/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to load plan (${res.status})`);
      const json = await res.json();
      setData(json.data as UserPlan);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error('Failed to load plan'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { data, isLoading, error, refetch: fetchPlan } as const;
}

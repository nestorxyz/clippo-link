import { useState, useEffect, useCallback, useRef } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { env } from '@/env';

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

interface PhoneStatus {
  hasPhone: boolean;
  phoneVerified: boolean;
  phoneNumber: string | null;
  whatsappEnabled: boolean;
}

export function usePhoneVerification() {
  const [phoneStatus, setPhoneStatus] = useState<PhoneStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Prevent multiple simultaneous calls
  const isCheckingRef = useRef(false);
  // Debounce timer
  const timeoutRef = useRef<NodeJS.Timeout>();

  const checkPhoneStatus = useCallback(
    async (forceRefresh = false) => {
      // Prevent duplicate calls unless forcing refresh
      if (isCheckingRef.current && !forceRefresh) {
        return;
      }

      try {
        isCheckingRef.current = true;
        setError(null);

        const {
          data: { session },
        } = await retired-provider.auth.getSession();

        if (!session) {
          setPhoneStatus(null);
          setCurrentUserId(null);
          setLoading(false);
          return;
        }

        // Only fetch if user changed or force refresh
        if (session.user.id === currentUserId && !forceRefresh) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setCurrentUserId(session.user.id);

        const response = await fetch(`${BACKEND_URL}/api/auth/phone-status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch phone status');
        }

        const data = await response.json();

        if (data.success) {
          setPhoneStatus(data.data);
        } else {
          throw new Error(data.message || 'Failed to get phone status');
        }
      } catch (err) {
        console.error('Error checking phone status:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPhoneStatus(null);
      } finally {
        setLoading(false);
        isCheckingRef.current = false;
      }
    },
    [currentUserId]
  );

  // Debounced version for auth state changes
  const debouncedCheckPhoneStatus = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      checkPhoneStatus();
    }, 300); // 300ms debounce
  }, [checkPhoneStatus]);

  useEffect(() => {
    // Initial check
    checkPhoneStatus();

    // Subscribe to auth state changes with debouncing
    const {
      data: { subscription },
    } = retired-provider.auth.onAuthStateChange((event, session) => {
      // Only check on meaningful auth events
      if (
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT' ||
        event === 'TOKEN_REFRESHED'
      ) {
        debouncedCheckPhoneStatus();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkPhoneStatus, debouncedCheckPhoneStatus]);

  const refresh = useCallback(() => {
    checkPhoneStatus(true); // Force refresh
  }, [checkPhoneStatus]);

  return {
    phoneStatus,
    loading,
    error,
    refresh,
    needsPhoneVerification: phoneStatus && !phoneStatus.phoneVerified,
  };
}

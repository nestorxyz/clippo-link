import { useState, useEffect, useCallback, useRef } from 'react';
import { env } from '@/env';
import { useAuth } from '@clerk/nextjs';

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

  const { getToken, userId, isLoaded } = useAuth();

  // Prevent multiple simultaneous calls
  const isCheckingRef = useRef(false);
  // Debounce timer
  const timeoutRef = useRef<NodeJS.Timeout>();

  const checkPhoneStatus = useCallback(
    async (forceRefresh = false) => {
      if (!isLoaded) return;

      // Prevent duplicate calls unless forcing refresh
      if (isCheckingRef.current && !forceRefresh) {
        return;
      }

      try {
        isCheckingRef.current = true;
        setError(null);

        if (!userId) {
          setPhoneStatus(null);
          setCurrentUserId(null);
          setLoading(false);
          return;
        }

        // Only fetch if user changed or force refresh
        if (userId === currentUserId && !forceRefresh) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setCurrentUserId(userId);

        const token = await getToken({ template: 'convex' });
        if (!token) throw new Error('No authenticated session');

        const response = await fetch(`${BACKEND_URL}/api/auth/phone-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If 401/403, maybe token expired or backend check failed.
          // We'll throw.
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
    [userId, isLoaded, getToken, currentUserId]
  );

  // Debounced version for auth state changes
  const debouncedCheckPhoneStatus = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      checkPhoneStatus();
    }, 300);
  }, [checkPhoneStatus]);

  useEffect(() => {
    checkPhoneStatus();
  }, [checkPhoneStatus]);

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

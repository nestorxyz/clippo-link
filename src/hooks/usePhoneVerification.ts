import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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

  const checkPhoneStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setPhoneStatus(null);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/auth/phone-status`, {
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
    }
  };

  useEffect(() => {
    checkPhoneStatus();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkPhoneStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refresh = () => {
    checkPhoneStatus();
  };

  return {
    phoneStatus,
    loading,
    error,
    refresh,
    needsPhoneVerification: phoneStatus && !phoneStatus.phoneVerified,
  };
}

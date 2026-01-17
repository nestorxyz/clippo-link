import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';

interface PhoneStatus {
  hasPhone: boolean;
  phoneVerified: boolean;
  phoneNumber: string | null;
  whatsappEnabled: boolean;
}

export function usePhoneVerification() {
  const profile = useQuery(api.profiles.currentProfile);

  // Map Convex profile to PhoneStatus interface
  const phoneStatus: PhoneStatus | null = profile
    ? {
        hasPhone: !!profile.phoneNumber,
        phoneVerified: profile.phoneVerified ?? false,
        phoneNumber: profile.phoneNumber ?? null,
        whatsappEnabled: profile.createdVia === 'whatsapp',
      }
    : null;

  return {
    phoneStatus,
    loading: profile === undefined,
    error: null,
    refresh: () => {
      // Convex queries refresh automatically
    },
    needsPhoneVerification: phoneStatus ? !phoneStatus.phoneVerified : false,
  };
}

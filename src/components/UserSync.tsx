'use client';

import { useUser } from '@clerk/nextjs';
import { useConvexAuth, useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const [storedUserId, setStoredUserId] = useState<Id<'users'> | null>(null);

  useEffect(() => {
    // Only try to store the user if Clerk is loaded, signed in, and Convex thinks we are authenticated
    if (!isLoaded || !isSignedIn || !isAuthenticated || !user) {
      return;
    }

    // We can use a simple flag or check to avoid spamming,
    // but the mutation itself handles idempotency (checking for existing user).
    // However, to be safe and avoid extra network calls, we can check if we already did it for this session.
    if (storedUserId) return;

    const syncUser = async () => {
      try {
        const id = await storeUser();
        setStoredUserId(id);
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, isAuthenticated, user, storeUser, storedUserId]);

  return null;
}

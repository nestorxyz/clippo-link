'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import { UserPlan } from '../../convex/billing';

interface UserContextType {
  user: Doc<'users'> | null | undefined;
  plan: UserPlan | null | undefined;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.current);
  const plan = useQuery(api.billing.getPlan);

  // We consider it loading if either query is undefined (still fetching)
  // unless we want to allow partial data. For now, strict loading.
  const isLoading = user === undefined || plan === undefined;

  return (
    <UserContext.Provider value={{ user, plan, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

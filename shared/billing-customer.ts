const CLERK_BILLING_PREFIX = 'clerk:';

export function billingExternalIdForClerkUser(clerkUserId: string): string {
  if (!clerkUserId) {
    throw new Error('A Clerk user ID is required');
  }

  return `${CLERK_BILLING_PREFIX}${clerkUserId}`;
}

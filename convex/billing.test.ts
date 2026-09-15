import { describe, expect, it } from 'vitest';
import {
  FREE_MONTHLY_LIMIT,
  GRACE_PERIOD_HOURS,
  PREMIUM_MONTHLY_LIMIT,
  subscriptionIsPremium,
} from './billing';

describe('subscription entitlement', () => {
  const now = Date.UTC(2026, 8, 15);

  it.each(['active', 'trialing', 'canceled'])(
    'keeps an eligible Polar %s subscription premium',
    (status) => {
      expect(subscriptionIsPremium({ provider: 'polar', status }, now)).toBe(
        true,
      );
    },
  );

  it.each(['incomplete', 'past_due', 'unpaid', 'paused'])(
    'does not grant premium for Polar status %s',
    (status) => {
      expect(subscriptionIsPremium({ provider: 'polar', status }, now)).toBe(
        false,
      );
    },
  );

  it('does not grant premium access without the Polar provider', () => {
    expect(subscriptionIsPremium({ status: 'active' }, now)).toBe(false);
  });

  it('ends access after the webhook grace period', () => {
    const endsAt = now - (GRACE_PERIOD_HOURS + 1) * 60 * 60 * 1000;
    expect(
      subscriptionIsPremium({ provider: 'polar', status: 'active', endsAt }, now),
    ).toBe(false);
  });
});

describe('monthly link quotas', () => {
  it('uses the approved free and premium limits', () => {
    expect(FREE_MONTHLY_LIMIT).toBe(20);
    expect(PREMIUM_MONTHLY_LIMIT).toBe(500);
  });
});

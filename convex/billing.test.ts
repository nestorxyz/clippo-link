import { describe, expect, it } from 'vitest';
import { GRACE_PERIOD_HOURS, subscriptionIsPremium } from './billing';

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

  it('preserves the existing Lemon status vocabulary', () => {
    expect(subscriptionIsPremium({ status: 'on_trial' }, now)).toBe(true);
    expect(subscriptionIsPremium({ status: 'cancelled' }, now)).toBe(true);
  });

  it('ends access after the webhook grace period', () => {
    const endsAt = now - (GRACE_PERIOD_HOURS + 1) * 60 * 60 * 1000;
    expect(
      subscriptionIsPremium({ provider: 'polar', status: 'active', endsAt }, now),
    ).toBe(false);
  });
});

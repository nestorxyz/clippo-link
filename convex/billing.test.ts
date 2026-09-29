import { describe, expect, it } from 'vitest';
import {
  FREE_MONTHLY_LIMIT,
  GRACE_PERIOD_HOURS,
  PREMIUM_MONTHLY_LIMIT,
  ownerGrantIsPremium,
  resolveUserPlan,
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

describe('owner Premium access', () => {
  const now = Date.UTC(2026, 8, 29);

  it('grants Premium without pretending to have a Polar subscription', () => {
    const plan = resolveUserPlan(undefined, { grantedAt: now - 1 }, now);
    expect(plan).toMatchObject({
      plan: 'premium',
      status: 'owner_grant',
      provider: 'owner',
      limit: 500,
    });
    expect(plan.managePortalUrl).toBeUndefined();
    expect(plan.period.start).toBe('2026-09-01T00:00:00.000Z');
    expect(plan.period.end).toBe('2026-10-01T00:00:00.000Z');
  });

  it('does not honor an expired or revoked owner grant', () => {
    expect(ownerGrantIsPremium({ grantedAt: now - 2, expiresAt: now - 1 }, now)).toBe(false);
    expect(ownerGrantIsPremium({ grantedAt: now - 2, revokedAt: now - 1 }, now)).toBe(false);
    expect(ownerGrantIsPremium({ grantedAt: now + 1 }, now)).toBe(false);
    expect(resolveUserPlan(undefined, { grantedAt: now - 2, expiresAt: now }, now).plan).toBe('free');
  });

  it('keeps a genuine Polar subscription as the billing source if both exist', () => {
    const plan = resolveUserPlan(
      {
        provider: 'polar',
        status: 'active',
        renewsAt: Date.UTC(2026, 9, 15),
        providerSubscriptionId: 'sub_test',
      },
      { grantedAt: now - 1 },
      now,
    );
    expect(plan.provider).toBe('polar');
    expect(plan.subscriptionId).toBe('sub_test');
    expect(plan.managePortalUrl).toBe('/api/billing/portal');
  });
});

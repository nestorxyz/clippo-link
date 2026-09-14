import { describe, expect, it } from 'vitest';
import {
  buildLegacyCheckoutUrl,
  isLegacyBillingPlan,
} from './legacy-lemon-checkout';

describe('legacy Lemon Squeezy checkout boundary', () => {
  it('recognizes only the currently supported plans', () => {
    expect(isLegacyBillingPlan('monthly')).toBe(true);
    expect(isLegacyBillingPlan('annual')).toBe(true);
    expect(isLegacyBillingPlan('free')).toBe(false);
    expect(isLegacyBillingPlan(null)).toBe(false);
  });

  it.each(['monthly', 'annual'] as const)(
    'adds email and discount to the %s checkout',
    (plan) => {
      const checkout = new URL(
        buildLegacyCheckoutUrl(plan, 'person+test@example.com'),
      );

      expect(checkout.protocol).toBe('https:');
      expect(checkout.hostname).toBe('misfitlabs.lemonsqueezy.com');
      expect(checkout.searchParams.get('checkout[email]')).toBe(
        'person+test@example.com',
      );
      expect(checkout.searchParams.get('checkout[discount_code]')).toBe(
        'BETALAUNCH',
      );
    },
  );

  it('omits an absent email without dropping the discount', () => {
    const checkout = new URL(buildLegacyCheckoutUrl('monthly'));

    expect(checkout.searchParams.has('checkout[email]')).toBe(false);
    expect(checkout.searchParams.get('checkout[discount_code]')).toBe(
      'BETALAUNCH',
    );
  });
});

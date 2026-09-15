import { describe, expect, it } from 'vitest';
import {
  buildPolarCheckoutRequest,
  buildPolarPortalRequest,
  isBillingPlan,
  resolvePolarBillingConfig,
  usesPolarBilling,
} from './polar';

describe('Polar billing configuration', () => {
  it('recognizes only supported paid plans', () => {
    expect(isBillingPlan('monthly')).toBe(true);
    expect(isBillingPlan('annual')).toBe(true);
    expect(isBillingPlan('free')).toBe(false);
    expect(isBillingPlan(null)).toBe(false);
  });

  it('keeps Polar disabled until explicitly selected', () => {
    expect(usesPolarBilling({})).toBe(false);
    expect(usesPolarBilling({ DORYAI_BILLING_PROVIDER: 'lemon' })).toBe(false);
    expect(usesPolarBilling({ DORYAI_BILLING_PROVIDER: 'polar' })).toBe(true);
  });

  it('defaults a configured Polar integration to sandbox', () => {
    expect(
      resolvePolarBillingConfig({
        POLAR_ACCESS_TOKEN: 'polar_test_token',
        POLAR_MONTHLY_PRODUCT_ID: 'monthly_product',
        POLAR_ANNUAL_PRODUCT_ID: 'annual_product',
      }),
    ).toEqual({
      accessToken: 'polar_test_token',
      server: 'sandbox',
      products: {
        monthly: 'monthly_product',
        annual: 'annual_product',
      },
    });
  });

  it('binds checkout and portal requests to the same internal customer ID', () => {
    const checkout = buildPolarCheckoutRequest({
      plan: 'annual',
      clerkUserId: 'user_123',
      email: 'person@example.com',
      name: 'Test Person',
      origin: 'https://preview.example.com',
      products: { monthly: 'monthly_product', annual: 'annual_product' },
    });
    const portal = buildPolarPortalRequest({
      clerkUserId: 'user_123',
      origin: 'https://preview.example.com',
    });

    expect(checkout).toMatchObject({
      products: ['annual_product'],
      externalCustomerId: 'clerk:user_123',
      successUrl: 'https://preview.example.com/dashboard?billing=success',
      returnUrl: 'https://preview.example.com/dashboard',
    });
    expect(portal).toEqual({
      externalCustomerId: 'clerk:user_123',
      returnUrl: 'https://preview.example.com/dashboard',
    });
  });

  it('rejects incomplete or invalid configuration', () => {
    expect(() => resolvePolarBillingConfig({})).toThrow(
      'Polar billing requires',
    );
    expect(() =>
      resolvePolarBillingConfig({
        POLAR_ACCESS_TOKEN: 'token',
        POLAR_MONTHLY_PRODUCT_ID: 'monthly',
        POLAR_ANNUAL_PRODUCT_ID: 'annual',
        POLAR_SERVER: 'preview',
      }),
    ).toThrow('POLAR_SERVER must be sandbox or production');
  });
});

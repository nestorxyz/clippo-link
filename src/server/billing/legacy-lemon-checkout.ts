export type LegacyBillingPlan = 'monthly' | 'annual';

const CHECKOUT_URLS: Record<LegacyBillingPlan, string> = {
  monthly:
    'https://misfitlabs.lemonsqueezy.com/buy/a1200a99-d915-43a1-94c7-26ccace2382d',
  annual:
    'https://misfitlabs.lemonsqueezy.com/buy/a9367717-b49e-4255-b831-541b9c63fdd2',
};

const DISCOUNT_CODE = 'BETALAUNCH';

export const isLegacyBillingPlan = (
  value: string | null,
): value is LegacyBillingPlan => value === 'monthly' || value === 'annual';

export const buildLegacyCheckoutUrl = (
  plan: LegacyBillingPlan,
  email?: string | null,
): string => {
  const url = new URL(CHECKOUT_URLS[plan]);

  if (email) {
    url.searchParams.set('checkout[email]', email);
  }

  url.searchParams.set('checkout[discount_code]', DISCOUNT_CODE);
  return url.toString();
};

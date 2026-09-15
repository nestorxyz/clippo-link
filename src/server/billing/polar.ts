import { Polar } from '@polar-sh/sdk';
import { billingExternalIdForClerkUser } from '../../../shared/billing-customer';

export type BillingPlan = 'monthly' | 'annual';
export type PolarServer = 'sandbox' | 'production';

type PolarEnvironment = Record<string, string | undefined>;

export interface PolarBillingConfig {
  accessToken: string;
  server: PolarServer;
  products: Record<BillingPlan, string>;
}

export function buildPolarCheckoutRequest(args: {
  plan: BillingPlan;
  clerkUserId: string;
  email?: string | null;
  name?: string | null;
  origin: string;
  products: Record<BillingPlan, string>;
}) {
  return {
    products: [args.products[args.plan]],
    externalCustomerId: billingExternalIdForClerkUser(args.clerkUserId),
    customerEmail: args.email,
    customerName: args.name,
    successUrl: `${args.origin}/dashboard?billing=success`,
    returnUrl: `${args.origin}/dashboard`,
    allowDiscountCodes: true,
    allowTrial: true,
  };
}

export function buildPolarPortalRequest(args: {
  clerkUserId: string;
  origin: string;
}) {
  return {
    externalCustomerId: billingExternalIdForClerkUser(args.clerkUserId),
    returnUrl: `${args.origin}/dashboard`,
  };
}

export function isBillingPlan(value: string | null): value is BillingPlan {
  return value === 'monthly' || value === 'annual';
}

export function usesPolarBilling(env: PolarEnvironment = process.env): boolean {
  return env.DORYAI_BILLING_PROVIDER === 'polar';
}

export function resolvePolarBillingConfig(
  env: PolarEnvironment = process.env,
): PolarBillingConfig {
  const accessToken = env.POLAR_ACCESS_TOKEN;
  const monthlyProductId = env.POLAR_MONTHLY_PRODUCT_ID;
  const annualProductId = env.POLAR_ANNUAL_PRODUCT_ID;
  const server = env.POLAR_SERVER ?? 'sandbox';

  if (!accessToken || !monthlyProductId || !annualProductId) {
    throw new Error(
      'Polar billing requires POLAR_ACCESS_TOKEN, POLAR_MONTHLY_PRODUCT_ID, and POLAR_ANNUAL_PRODUCT_ID',
    );
  }

  if (server !== 'sandbox' && server !== 'production') {
    throw new Error('POLAR_SERVER must be sandbox or production');
  }

  return {
    accessToken,
    server,
    products: {
      monthly: monthlyProductId,
      annual: annualProductId,
    },
  };
}

export async function createPolarCheckoutUrl(args: {
  plan: BillingPlan;
  clerkUserId: string;
  email?: string | null;
  name?: string | null;
  origin: string;
  env?: PolarEnvironment;
}): Promise<string> {
  const config = resolvePolarBillingConfig(args.env);
  const polar = new Polar({
    accessToken: config.accessToken,
    server: config.server,
  });
  const checkout = await polar.checkouts.create(
    buildPolarCheckoutRequest({ ...args, products: config.products }),
  );

  return checkout.url;
}

export async function createPolarPortalUrl(args: {
  clerkUserId: string;
  origin: string;
  env?: PolarEnvironment;
}): Promise<string> {
  const config = resolvePolarBillingConfig(args.env);
  const polar = new Polar({
    accessToken: config.accessToken,
    server: config.server,
  });
  const session = await polar.customerSessions.create(
    buildPolarPortalRequest(args),
  );

  return session.customerPortalUrl;
}

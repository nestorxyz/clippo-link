import { query } from './_generated/server';
import { v } from 'convex/values';

// Billing / quota configuration and helper utilities
export const FREE_MONTHLY_LIMIT = 20;
export const PREMIUM_MONTHLY_LIMIT = 500;

export const PREMIUM_STATUSES = ['active', 'trialing', 'canceled'];
export const GRACE_PERIOD_HOURS = 24; // webhook delay tolerance

export interface PlanPeriod {
  start: string; // ISO
  end: string; // ISO
}

export interface UserPlan {
  plan: 'free' | 'premium';
  status: string | null; // subscription status or 'free'
  limit: number;
  period: PlanPeriod;
  used: number;
  remaining: number;
  provider?: string;
  subscriptionId?: string;
  variantId?: string | null;
  managePortalUrl?: string | null;
  renewsAt?: string; // raw provider renewal date (ISO)
  trialEndsAt?: string | null; // ISO if on trial
}

export function getCalendarMonthPeriodUtc(date = new Date()): PlanPeriod {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const periodStart = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const periodEnd = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
  return { start: periodStart.toISOString(), end: periodEnd.toISOString() };
}

export function getPreviousIntervalStart(renewsAt: string): string {
  // For premium users we base period on subscription cycle, not calendar month.
  // We only store next renews_at, so derive start by subtracting interval length.
  const end = new Date(renewsAt);
  let start: Date;
  start = new Date(
    Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth() - 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
      end.getUTCSeconds(),
      end.getUTCMilliseconds(),
    ),
  );
  return start.toISOString();
}

type SubscriptionRecord = {
  provider?: string;
  status: string;
  endsAt?: number;
};

export function subscriptionIsPremium(
  subscription: SubscriptionRecord | undefined,
  now = Date.now(),
): boolean {
  if (!subscription) return false;

  const inGrace = subscription.endsAt
    ? (now - subscription.endsAt) / 1000 / 3600 < GRACE_PERIOD_HOURS
    : true;
  return (
    subscription.provider === 'polar' &&
    PREMIUM_STATUSES.includes(subscription.status) &&
    inGrace
  );
}

export const getPlan = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return null;
    }

    const userId = user._id;

    // Get Active Subscription Logic
    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      // Logic from SQL: order('renews_at', { ascending: false }).limit(1)
      // Convex doesn't allow direct sorting on all fields easily without index,
      // but we can just get all and sort in memory if needed, or rely on logic.
      // Usually user has one active sub. Let's fetch all and pick the best one.
      .collect();

    // Sort by renewsAt descending
    sub.sort((a, b) => b.renewsAt - a.renewsAt);

    const data = sub[0]; // "maybeSingle" equivalent of the top one

    let userPlan: UserPlan;

    const isPremium = subscriptionIsPremium(data);

    if (!isPremium || !data) {
      const period = getCalendarMonthPeriodUtc();
      userPlan = {
        plan: 'free',
        status: 'free',
        limit: FREE_MONTHLY_LIMIT,
        period,
        used: 0,
        remaining: FREE_MONTHLY_LIMIT,
      };
    } else {
      const renewsAtIso = new Date(data.renewsAt).toISOString();
      const periodEnd = renewsAtIso;
      const periodStart = data.currentPeriodStart
        ? new Date(data.currentPeriodStart).toISOString()
        : getPreviousIntervalStart(renewsAtIso);
      const limit = PREMIUM_MONTHLY_LIMIT;

      userPlan = {
        plan: 'premium',
        status: data.status,
        limit,
        period: { start: periodStart, end: periodEnd },
        used: 0,
        remaining: limit,
        provider: 'polar',
        subscriptionId: data.providerSubscriptionId,
        variantId: data.variantId,
        managePortalUrl: '/api/billing/portal',
        renewsAt: renewsAtIso,
        trialEndsAt: data.trialEndsAt
          ? new Date(data.trialEndsAt).toISOString()
          : null,
      };
    }

    // Calculate usage
    // "links" table, "created_at" is periodStartIso <= created_at < periodEndIso
    // Note: convex stores times as numbers (ms), our periods are ISO strings.
    const startMs = new Date(userPlan.period.start).getTime();
    const endMs = new Date(userPlan.period.end).getTime();

    // We need to count links created in this range.
    // Ideally we have an index on (userId, createdAt).
    // The schema has .index('by_user', ['userId']).
    // We can filter by createdAt in memory or range query if we had (userId, createdAt).
    // Given the schema only has 'by_user' ['userId'] and 'createdAt' is just a field:
    // We will fetch links by user and filter.
    // Optimization: If many links, this might be slow, but for now it matches the backend logic.
    // Actually, SQL did: .gte('created_at', periodStartIso).lt('created_at', periodEndIso) which is efficient.
    // In Convex with just 'by_user', we have to iterate.
    const links = await ctx.db
      .query('links')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(
          q.gte(q.field('createdAt'), startMs),
          q.lt(q.field('createdAt'), endMs),
        ),
      )
      .collect();

    const used = links.length;
    userPlan.used = used;
    userPlan.remaining = Math.max(userPlan.limit - used, 0);

    return userPlan;
  },
});

export const getPlanForBackend = query({
  args: {
    userId: v.id('users'),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate secret
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized');
    }

    const { userId } = args;

    // Get Active Subscription Logic
    const sub = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    // Sort by renewsAt descending
    sub.sort((a, b) => b.renewsAt - a.renewsAt);

    const data = sub[0];

    let userPlan: UserPlan; // Use the interface from above

    const isPremium = subscriptionIsPremium(data);

    if (!isPremium || !data) {
      const period = getCalendarMonthPeriodUtc();
      userPlan = {
        plan: 'free',
        status: 'free',
        limit: FREE_MONTHLY_LIMIT,
        period,
        used: 0,
        remaining: FREE_MONTHLY_LIMIT,
      };
    } else {
      const renewsAtIso = new Date(data.renewsAt).toISOString();
      const periodEnd = renewsAtIso;
      const periodStart = data.currentPeriodStart
        ? new Date(data.currentPeriodStart).toISOString()
        : getPreviousIntervalStart(renewsAtIso);
      const limit = PREMIUM_MONTHLY_LIMIT;

      userPlan = {
        plan: 'premium',
        status: data.status,
        limit,
        period: { start: periodStart, end: periodEnd },
        used: 0,
        remaining: limit,
        provider: 'polar',
        subscriptionId: data.providerSubscriptionId,
        variantId: data.variantId,
        managePortalUrl: '/api/billing/portal',
        renewsAt: renewsAtIso,
        trialEndsAt: data.trialEndsAt
          ? new Date(data.trialEndsAt).toISOString()
          : null,
      };
    }

    // Calculate usage
    const startMs = new Date(userPlan.period.start).getTime();
    const endMs = new Date(userPlan.period.end).getTime();

    const links = await ctx.db
      .query('links')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(
          q.gte(q.field('createdAt'), startMs),
          q.lt(q.field('createdAt'), endMs),
        ),
      )
      .collect();

    const used = links.length;
    userPlan.used = used;
    userPlan.remaining = Math.max(userPlan.limit - used, 0);

    return userPlan;
  },
});

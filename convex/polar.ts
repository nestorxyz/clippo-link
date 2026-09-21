import { WebhookVerificationError } from 'standardwebhooks';
import { internalMutation, httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { verifyPolarSubscriptionWebhook } from './lib/polarWebhook';

export const processWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error('POLAR_WEBHOOK_SECRET is not set');
    return new Response('Server Configuration Error', { status: 500 });
  }

  const rawBody = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event;
  try {
    event = verifyPolarSubscriptionWebhook(rawBody, headers, secret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error('Unable to verify Polar webhook', error.message);
      return new Response('Invalid signature', { status: 403 });
    }
    console.error('Unable to parse Polar webhook', error);
    return new Response('Invalid payload', { status: 400 });
  }

  const eventId = request.headers.get('webhook-id');
  if (!eventId) {
    return new Response('Missing webhook ID', { status: 400 });
  }

  if (!event.data) {
    return Response.json({ success: true, ignored: true });
  }

  const subscription = event.data;
  const externalCustomerId = subscription.customer.externalId;
  if (!externalCustomerId) {
    return new Response('Missing external customer ID', { status: 400 });
  }

  try {
    const result = await ctx.runMutation(internal.polar.applySubscriptionEvent, {
      eventId,
      eventName: event.type,
      eventTimestamp: event.timestamp.getTime(),
      externalCustomerId,
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      productId: subscription.productId,
      status:
        event.type === 'subscription.revoked'
          ? 'revoked'
          : subscription.status,
      currentPeriodStart: subscription.currentPeriodStart.getTime(),
      currentPeriodEnd: subscription.currentPeriodEnd.getTime(),
      trialEndsAt: subscription.trialEnd?.getTime(),
      endsAt: subscription.endsAt?.getTime(),
    });
    return Response.json({ success: true, duplicate: result.duplicate });
  } catch (error) {
    console.error('Unable to apply Polar subscription webhook', error);
    return new Response('Unable to process webhook', { status: 500 });
  }
});

export const applySubscriptionEvent = internalMutation({
  args: {
    eventId: v.string(),
    eventName: v.string(),
    eventTimestamp: v.number(),
    externalCustomerId: v.string(),
    subscriptionId: v.string(),
    customerId: v.string(),
    productId: v.string(),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEndsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existingEvent = await ctx.db
      .query('subscriptionWebhookEvents')
      .withIndex('by_provider_event', (q) =>
        q.eq('provider', 'polar').eq('providerEventId', args.eventId),
      )
      .unique();
    if (existingEvent) {
      return { duplicate: true };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_billing_external_id', (q) =>
        q.eq('billingExternalId', args.externalCustomerId),
      )
      .unique();
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const existingSubscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_provider_subscription', (q) =>
        q
          .eq('provider', 'polar')
          .eq('providerSubscriptionId', args.subscriptionId),
      )
      .unique();

    const subscription = {
      userId: user._id,
      provider: 'polar',
      providerSubscriptionId: args.subscriptionId,
      providerCustomerId: args.customerId,
      productId: args.productId,
      status: args.status,
      currentPeriodStart: args.currentPeriodStart,
      renewsAt: args.currentPeriodEnd,
      trialEndsAt: args.trialEndsAt,
      endsAt: args.endsAt,
      providerEventTimestamp: args.eventTimestamp,
      updatedAt: Date.now(),
    };

    const isStale =
      existingSubscription?.providerEventTimestamp !== undefined &&
      existingSubscription.providerEventTimestamp > args.eventTimestamp;

    if (existingSubscription && !isStale) {
      await ctx.db.patch(existingSubscription._id, subscription);
    } else if (!existingSubscription) {
      await ctx.db.insert('subscriptions', {
        ...subscription,
        createdAt: Date.now(),
      });
    }

    await ctx.db.insert('subscriptionWebhookEvents', {
      provider: 'polar',
      providerEventId: args.eventId,
      eventName: args.eventName,
      eventKey: `polar:${args.eventId}`,
      rawPayload: {
        subscriptionId: args.subscriptionId,
        status: args.status,
        eventTimestamp: args.eventTimestamp,
        stale: isStale,
      },
      receivedAt: Date.now(),
      duplicate: false,
    });

    return { duplicate: false };
  },
});

import { httpAction, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// Web Crypto API helper to verify HMAC SHA-256 signature
async function verifySignature(
  secret: string,
  payload: string,
  signature: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  // Lemon Squeezy sends signature as hex string, we need to convert it to ArrayBuffer
  const signatureBuffer = new Uint8Array(
    signature.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  );

  return crypto.subtle.verify(
    'HMAC',
    key,
    signatureBuffer,
    encoder.encode(payload),
  );
}

export const processWebhook = httpAction(async (ctx, request) => {
  try {
    const rawString = await request.text();
    const signatureHeader = request.headers.get('X-Signature') || '';
    const secret = process.env.LEMON_WEBHOOK_SIGNING_SECRET || '';

    if (!secret) {
      console.error('LEMON_WEBHOOK_SIGNING_SECRET is not set');
      return new Response('Server Configuration Error', { status: 500 });
    }

    const isValid = await verifySignature(secret, rawString, signatureHeader);

    // Check signature
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_SIGNATURE' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      throw new Error('Invalid JSON');
    }

    const eventName = parsed.meta?.event_name;
    const dataObj = parsed.data;
    const lemonId = dataObj?.id;
    const objectType = dataObj?.type;
    const eventKey = `${eventName}:${objectType}:${lemonId}`;

    // Record the event and check for duplicates
    const { duplicate } = await ctx.runMutation(internal.lemon.recordEvent, {
      eventName,
      lemonObjectType: objectType,
      lemonObjectId: lemonId,
      eventKey,
      rawPayload: parsed,
      signature: signatureHeader,
    });

    if (duplicate) {
      return new Response(JSON.stringify({ success: true, duplicate: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!eventName) throw new Error('Missing event_name');
    if (!objectType) throw new Error('Missing object type');

    if (objectType !== 'subscriptions') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Ignored non-subscription object',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Process Subscription Data
    const attr = dataObj.attributes || {};
    // Extract fields
    const status = attr.status;
    const renews_at = attr.renews_at;
    const ends_at = attr.ends_at || null;
    const product_id = attr.product_id ? String(attr.product_id) : undefined;
    const variant_id = attr.variant_id ? String(attr.variant_id) : undefined;
    const customer_id = attr.customer_id ? String(attr.customer_id) : undefined;
    const trial_ends_at = attr.trial_ends_at || null;
    const card_brand = attr.card_brand || undefined;
    const card_last_four = attr.card_last_four || undefined;
    const update_payment_method_url =
      attr.urls?.update_payment_method || undefined;
    const customer_portal_url = attr.urls?.customer_portal || undefined;
    const user_email = attr.user_email || null;

    if (!user_email) {
      console.error('Subscription webhook missing user_email');
      return new Response(
        JSON.stringify({ success: false, error: 'NO_EMAIL' }),
        { status: 400 },
      );
    }

    // Convert ISO strings to timestamps if they exist
    const parseDate = (d: string | null) =>
      d ? new Date(d).getTime() : undefined;

    await ctx.runMutation(internal.lemon.manageSubscription, {
      userEmail: user_email,
      lemonSubscriptionId: lemonId,
      productId: product_id,
      variantId: variant_id,
      customerId: customer_id,
      status,
      trialEndsAt: parseDate(trial_ends_at),
      renewsAt: new Date(renews_at).getTime(),
      endsAt: parseDate(ends_at),
      cardBrand: card_brand,
      cardLastFour: card_last_four,
      updatePaymentMethodUrl: update_payment_method_url,
      customerPortalUrl: customer_portal_url,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Lemon webhook error', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'SERVER_ERROR',
        message: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});

export const recordEvent = internalMutation({
  args: {
    eventName: v.string(),
    lemonObjectType: v.string(),
    lemonObjectId: v.string(),
    eventKey: v.string(),
    rawPayload: v.any(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('subscriptionWebhookEvents')
      .withIndex('by_event_key', (q) => q.eq('eventKey', args.eventKey))
      .first();

    if (existing) {
      return { duplicate: true };
    }

    await ctx.db.insert('subscriptionWebhookEvents', {
      eventName: args.eventName,
      lemonObjectType: args.lemonObjectType,
      lemonObjectId: args.lemonObjectId,
      eventKey: args.eventKey,
      rawPayload: args.rawPayload,
      signature: args.signature,
      receivedAt: Date.now(),
      duplicate: false,
    });
    return { duplicate: false };
  },
});

export const manageSubscription = internalMutation({
  args: {
    userEmail: v.string(),
    lemonSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    variantId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    status: v.string(),
    trialEndsAt: v.optional(v.number()),
    renewsAt: v.number(),
    endsAt: v.optional(v.number()),
    cardBrand: v.optional(v.string()),
    cardLastFour: v.optional(v.string()),
    updatePaymentMethodUrl: v.optional(v.string()),
    customerPortalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Find User
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.userEmail))
      .first();

    if (!user) {
      console.error(
        'Subscription webhook user not found by email',
        args.userEmail,
      );
      // We throw error here to be caught by the action catch block
      throw new Error('USER_NOT_FOUND');
    }

    // 2. Find existing subscription
    const existingSub = await ctx.db
      .query('subscriptions')
      .withIndex('by_lemon_subscription_id', (q) =>
        q.eq('lemonSubscriptionId', args.lemonSubscriptionId),
      )
      .unique();

    const payload = {
      userId: user._id,
      lemonSubscriptionId: args.lemonSubscriptionId,
      productId: args.productId,
      variantId: args.variantId,
      customerId: args.customerId,
      status: args.status,
      trialEndsAt: args.trialEndsAt,
      renewsAt: args.renewsAt,
      endsAt: args.endsAt,
      cardBrand: args.cardBrand,
      cardLastFour: args.cardLastFour,
      updatePaymentMethodUrl: args.updatePaymentMethodUrl,
      customerPortalUrl: args.customerPortalUrl,
      updatedAt: Date.now(),
    };

    if (existingSub) {
      await ctx.db.patch(existingSub._id, payload);
    } else {
      await ctx.db.insert('subscriptions', {
        ...payload,
        createdAt: Date.now(),
      });
    }
  },
});

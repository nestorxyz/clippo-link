import { describe, expect, it } from 'vitest';
import { Webhook } from 'standardwebhooks';
import { verifyPolarSubscriptionWebhook } from './polarWebhook';

const secret = 'whsec_dGVzdF9wb2xhcl93ZWJob29rX3NlY3JldA==';
const body = JSON.stringify({
  type: 'subscription.active',
  timestamp: '2026-09-21T05:00:00.000Z',
  data: {
    id: 'sub_test',
    customer_id: 'customer_test',
    product_id: 'product_test',
    status: 'active',
    current_period_start: '2026-09-21T05:00:00.000Z',
    current_period_end: '2026-10-21T05:00:00.000Z',
    trial_end: null,
    ends_at: null,
    customer: { external_id: 'user_test' },
  },
});

function signedHeaders(payload: string) {
  const timestamp = new Date();
  const webhook = new Webhook(secret);
  return {
    'webhook-id': 'event_test',
    'webhook-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
    'webhook-signature': webhook.sign('event_test', timestamp, payload),
  };
}

describe('verifyPolarSubscriptionWebhook', () => {
  it('verifies Standard Webhooks signatures and normalizes the payload', () => {
    const event = verifyPolarSubscriptionWebhook(
      body,
      signedHeaders(body),
      secret,
    );

    expect(event.type).toBe('subscription.active');
    expect(event.data?.customer.externalId).toBe('user_test');
    expect(event.data?.currentPeriodEnd.toISOString()).toBe(
      '2026-10-21T05:00:00.000Z',
    );
  });

  it('rejects a body changed after it was signed', () => {
    expect(() =>
      verifyPolarSubscriptionWebhook(
        body.replace('active', 'canceled'),
        signedHeaders(body),
        secret,
      ),
    ).toThrow('No matching signature found');
  });
});

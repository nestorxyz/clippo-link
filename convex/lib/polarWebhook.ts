import { Webhook } from 'standardwebhooks';

export const POLAR_SUBSCRIPTION_EVENT_TYPES = new Set([
  'subscription.created',
  'subscription.updated',
  'subscription.active',
  'subscription.canceled',
  'subscription.uncanceled',
  'subscription.revoked',
  'subscription.past_due',
]);

export type PolarSubscriptionWebhookEvent = {
  type: string;
  timestamp: Date;
  data?: {
    id: string;
    customerId: string;
    productId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    trialEnd?: Date;
    endsAt?: Date;
    customer: {
      externalId: string;
    };
  };
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown, field: string): JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value as JsonRecord;
}

function requiredString(record: JsonRecord, field: string): string {
  const value = record[field];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

function requiredDate(record: JsonRecord, field: string): Date {
  const value = requiredString(record, field);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${field}`);
  }
  return date;
}

function optionalDate(record: JsonRecord, field: string): Date | undefined {
  const value = record[field];
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${field}`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${field}`);
  }
  return date;
}

export function verifyPolarSubscriptionWebhook(
  rawBody: string,
  headers: Record<string, string>,
  secret: string,
): PolarSubscriptionWebhookEvent {
  const payload = new Webhook(secret).verify(rawBody, headers);
  const event = asRecord(payload, 'event');
  const type = requiredString(event, 'type');
  const timestamp = requiredDate(event, 'timestamp');

  if (!POLAR_SUBSCRIPTION_EVENT_TYPES.has(type)) {
    return { type, timestamp };
  }

  const data = asRecord(event.data, 'data');
  const customer = asRecord(data.customer, 'customer');

  return {
    type,
    timestamp,
    data: {
      id: requiredString(data, 'id'),
      customerId: requiredString(data, 'customer_id'),
      productId: requiredString(data, 'product_id'),
      status: requiredString(data, 'status'),
      currentPeriodStart: requiredDate(data, 'current_period_start'),
      currentPeriodEnd: requiredDate(data, 'current_period_end'),
      trialEnd: optionalDate(data, 'trial_end'),
      endsAt: optionalDate(data, 'ends_at'),
      customer: {
        externalId: requiredString(customer, 'external_id'),
      },
    },
  };
}

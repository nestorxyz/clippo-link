# Polar billing migration

Status: Polar-only implementation; sandbox activation still needs provider
credentials and live verification.

Last reviewed: 2026-09-15

## Current boundary

DoryAI uses Polar exclusively. Incomplete configuration returns a
service-unavailable response; it never falls back to another checkout.

Polar defaults to its sandbox server. Production requires the explicit pair:

```text
POLAR_SERVER=production
```

The server-only variables required by the web runtime are:

```text
POLAR_ACCESS_TOKEN=
POLAR_MONTHLY_PRODUCT_ID=
POLAR_ANNUAL_PRODUCT_ID=
```

The Convex deployment that receives `/polar` webhooks separately requires:

```text
POLAR_WEBHOOK_SECRET=
```

Do not copy sandbox tokens, product IDs, customers, or webhook secrets into
production. Do not commit any of these values.

## Implemented flow

1. `/auth/after` requires a Clerk session and a recognized monthly or annual
   plan.
2. With Polar selected, the server creates a checkout through the official
   SDK. The access token never crosses the server boundary.
3. The checkout uses `clerk:<Clerk user ID>` as Polar's external customer ID.
   Convex stores the same namespaced value during authenticated user sync.
4. Polar posts signed subscription events to the Convex `/polar` endpoint.
5. The official SDK verifies and parses the original request before any write.
6. One Convex transaction deduplicates the provider event, resolves its user by
   external customer ID, rejects stale event state, updates the subscription,
   and stores a minimal processing record.
7. Premium Polar users receive `/api/billing/portal` as their management URL;
   that authenticated route creates a short-lived portal session.

Legacy subscription fields remain optional in the schema only to permit a safe
production data migration; no active route reads or writes them.

## Entitlement rules

Polar `active`, `trialing`, and end-of-period `canceled` subscriptions retain
premium access. `incomplete`, `past_due`, `unpaid`, and `paused` do not. A
`subscription.revoked` event is normalized to a non-premium `revoked` state so
access ends immediately. The existing 24-hour webhook grace rule remains in
place for other ended records.

The approved limits are 20 monthly saves for free users and 500 for premium
users. Product configuration, UI copy, and enforcement tests must stay aligned.

## Sandbox verification

The following work changes Polar, Convex, or user billing state and requires an
approved sandbox account and credentials:

- Create separate monthly and annual sandbox products matching the approved
  price, trial, and quota terms.
- Configure the sandbox webhook to the exact deployed Convex `/polar` URL. Do
  not use a URL that redirects.
- Set the web variables with `POLAR_SERVER=sandbox` and set the Convex webhook
  secret in the matching non-production deployment.
- Sign in with an approved test account, complete a sandbox checkout, and
  capture the checkout ID and provider webhook ID without recording payment or
  personal data.
- Verify one subscription row, one processed-event record, premium UI state,
  the usage boundary, and the customer portal.
- Redeliver the same webhook and verify it reports `duplicate: true` without a
  second subscription or event record.
- Send or replay an older valid subscription event and verify it is recorded as
  stale without replacing the newer entitlement state.
- Cancel at period end and verify access remains until the period end; then
  verify revocation removes access.

Only after those readbacks, existing-subscriber obligations, and approved legal
copy are complete should `POLAR_SERVER=production` be configured.

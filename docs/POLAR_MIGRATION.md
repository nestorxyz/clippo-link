# Polar billing migration

Status: implemented behind configuration; not activated or verified against a
Polar account.

Last reviewed: 2026-09-15

## Current boundary

DoryAI continues to use the existing Lemon Squeezy checkout unless
`DORYAI_BILLING_PROVIDER=polar` is set. Selecting Polar without complete
configuration returns a service-unavailable response; it does not silently
fall back to a different checkout.

Polar defaults to its sandbox server. Production requires the explicit pair:

```text
DORYAI_BILLING_PROVIDER=polar
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

Lemon records remain readable. New fields are optional so the schema change
does not require rewriting existing subscription rows before a migration is
approved.

## Entitlement rules

Polar `active`, `trialing`, and end-of-period `canceled` subscriptions retain
premium access. `incomplete`, `past_due`, `unpaid`, and `paused` do not. A
`subscription.revoked` event is normalized to a non-premium `revoked` state so
access ends immediately. The existing 24-hour webhook grace rule remains in
place for other ended records.

There is one unresolved product decision: the current code grants 500 monthly
saves to free users and only 200 to premium users. Do not activate or advertise
the Polar plans until the owner approves coherent free and paid quotas and the
same values appear in product configuration, UI copy, and enforcement tests.

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

Only after those readbacks, existing-subscriber obligations, legal copy, and an
owner-approved production cutover plan are complete should the production
provider variables change.

## Rollback

Unset `DORYAI_BILLING_PROVIDER` (or set it to `lemon`) in the web runtime to
restore the legacy checkout path. This does not delete Polar customers,
subscriptions, or Convex evidence. A production rollback therefore also needs
an explicit decision about already-created Polar subscriptions; never leave
paying customers active at one provider while DoryAI reads entitlement only
from another.

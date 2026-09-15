# DoryAI V1 release checklist

Checklist version: 2026-09-15

Verified web implementation revision: `54fbb1f`

Verified backend implementation revision: `da7c480`

This is the canonical paired release checklist for the private `clippo-link` and
`clippo-backend` repositories. A checked box means the named verifier was run
against the listed implementation or a later revision and produced the stated
readback. A build, test, or Preview URL does not substitute for another box.

## Automated gates

- [x] Web `npm run check`: 16 tests and 18-route production build passed.
- [x] Backend `npm run check`: 42 tests and strict TypeScript build passed.
- [x] Both `npm audit --audit-level=low` runs report zero known vulnerabilities.
- [x] GitHub Actions passed for web run `34994109394` and backend run
  `34914995285`.
- [x] Both listed implementation revisions exist on their private remote feature
  branches.

## Setup and security

- [x] Web and backend setup/environment documentation matches current runtime
  boundaries.
- [x] Exact implementation patches passed redacted Gitleaks scans.
- [ ] Identify and rotate or decommission the historical retired-provider anonymous JWT
  retained once in each repository's history.
- [ ] Review transitive dependency and bundled asset rights.
- [ ] Obtain owner approval for a license and apply it.
- [ ] Obtain explicit approval before changing either repository's visibility.

## Core save and find flow

- [x] Fixture-backed general webpage extraction passes guarded transport tests.
- [x] Fixture-backed YouTube long-video metadata/caption extraction passes.
- [x] LinkedIn and X return honest public-page or URL-only degraded results.
- [x] Lexical retrieval passes the fixed five-case evaluation.
- [x] Duplicate retries are idempotent at the Convex mutation boundary.
- [ ] With an approved test account, save and read back one general webpage.
- [ ] Save and read back one YouTube long video.
- [ ] Verify LinkedIn and X degraded behavior through authenticated chat.
- [ ] Repeat a saved URL and verify no second Convex link or thumbnail job.
- [ ] Retrieve the intended saved link through natural-language chat and verify
  the visible citation/result.
- [ ] Exercise a backend/tool failure and verify the visible retry path.

## Activation and UI

- [x] First-save/first-retrieval state logic is fixture tested.
- [x] Public landing page rendered locally at desktop width.
- [x] Public landing page rendered through Chrome at a 390×844 viewport; the
  full page and above-the-fold captures showed no visible horizontal clipping.
- [ ] Verify matching Clerk publishable/secret configuration for the target
  environment. The local production server reported a session-refresh redirect
  loop consistent with mismatched Clerk keys after the public mobile capture.
- [ ] Complete the full fresh-account activation flow at desktop width.
- [ ] Complete the same flow at a mobile-sized viewport or physical device.
- [ ] Capture the final desktop and mobile evidence without private user data.

## Billing

- [x] The current Lemon Squeezy checkout URL boundary has focused tests.
- [x] Polar checkout, customer identity, signed webhook, idempotency,
  out-of-order event, and portal boundaries are implemented behind an explicit
  provider switch that defaults Polar to sandbox.
- [ ] Owner approves Polar or explicitly approves retaining Lemon Squeezy.
- [ ] Owner approves coherent free and premium quotas; current enforcement is
  500 monthly saves for free and 200 for premium.
- [ ] Sandbox checkout succeeds with a signed, idempotent webhook readback.
- [ ] Entitlement and customer-portal state match the sandbox purchase.
- [ ] Existing subscriber/data obligations are documented before any migration.

## SEO, legal, and deployment

- [x] Local metadata, crawler rules, sitemap, canonical, and social-card output
  match configured-environment tests and HTTP readbacks.
- [x] Rendered Privacy/Security pages name current processors and do not contain
  the previously identified unsupported security/compliance promises.
- [ ] Owner or qualified reviewer approves Privacy Policy and Terms for release.
- [ ] Set and verify the intended canonical production domain; `doryai.app` did
  not resolve on 2026-09-15.
- [ ] Configure a scoped Convex deployment for Vercel Preview. Deployment
  `6463349271` for web `54fbb1f` failed because no deployment key or self-hosted
  configuration was available.
- [ ] Record final release revisions, then deploy the web/Convex revision before
  the backend revision.
- [ ] Verify Preview health plus authenticated save, duplicate, retrieval,
  history, and billing-sandbox readbacks on the deployed revisions.
- [ ] Obtain explicit approval for production deployment, then verify the exact
  final production revisions and health.

## Mobile decision

- [ ] Record responsive-web/PWA evidence against the complete core workflow.
- [ ] Decide PWA, wrapper, or native from identified capability gaps.
- [ ] If native remains justified, approve its platform, auth/share, offline,
  privacy, testing, and store criteria before implementation.

## Release result

- [ ] Every required box above is checked or replaced by a dated, owner-approved
  exception that does not contradict the V1 goal.
- [ ] Copy final revisions and independent readbacks into the control-plane
  `projects/doryai/RESULT.md`.

# DoryAI architecture

This document owns the cross-repository runtime map. It describes the current
system; roadmap items are labeled explicitly rather than presented as shipped.

## Components

1. **Next.js web app (`clippo-link`)** renders the landing, authentication,
   dashboard, link-management, settings, and billing-entry experiences.
2. **Clerk** authenticates browser users.
3. **Convex in `clippo-link/convex`** owns application data, user-scoped
   queries/mutations, chat sessions, storage, billing state, and the action that
   calls the private backend.
4. **Express backend (`clippo-backend`)** owns Gemini orchestration and media
   processing that should not execute in the browser or a Convex mutation.
5. **Gemini and source platforms** are external processors/sources. Their
   availability and responses are not controlled by DoryAI.
6. **Lemon Squeezy** is the current billing implementation. Polar is a planned,
   separately approval-gated migration.

## Trust and request flow

```text
Browser
  | Clerk identity
  v
Next.js UI -----> user-scoped Convex queries and mutations
                         |
                         | authenticated Convex action
                         | + server-only shared secret
                         v
                 Express /api/chat
                         |
              +----------+-----------+
              |                      |
              v                      v
           Gemini             source/media tools
              |                      |
              +----------+-----------+
                         |
                         | privileged, user-bound Convex calls
                         v
                   Convex data/storage
```

The browser must never receive `CLERK_SECRET_KEY`, `CONVEX_BACKEND_SECRET`,
billing webhook secrets, migration service keys, or provider credentials. The
backend secret authenticates the service boundary but does not replace user
scope: privileged calls still carry and validate the intended user/session.

## Data ownership

- Convex owns current users, links, categories, subcategories, tags, chat
  sessions/messages, storage references, plan state, and webhook idempotency.
- retired-provider code under `src/integrations/retired-provider` and `scripts/migrate.ts` is
  legacy migration support, not the normal runtime owner.
- The backend is stateless apart from bounded in-memory aggregation/deduplication
  and temporary media files. In-memory state is not durable or horizontally
  shared.
- Temporary local/provider media must be cleaned up after processing.

## Source ingestion state

The backend `source-url.ts` boundary recognizes Instagram Reels, TikTok videos,
YouTube long videos/shorts, LinkedIn, X/Twitter, and general HTTP(S) pages.
Recognition is not extraction support.

- **Implemented specialized path:** Instagram Reels and TikTok videos, with a
  metadata-only fallback when the media toolchain is unavailable.
- **Recognized but planned:** YouTube, LinkedIn, and X.
- **General page boundary:** classified, but safe fetching/content extraction is
  not complete.

Before general fetching ships, it needs private-network and cloud-metadata
blocking, redirect revalidation, time/size/content-type limits, deterministic
normalization, and provenance.

## Billing state

The current `/auth/after` route selects a fixed Lemon Squeezy monthly or annual
checkout, adds the authenticated email when available, and applies the existing
beta discount. Pure URL construction is tested in
`src/server/billing/legacy-lemon-checkout.test.ts`.

The Convex Lemon webhook verifies its signing secret and records subscription
events. Polar must not replace this path until products, signed/idempotent
webhooks, entitlements, portal behavior, existing subscriber obligations, and a
sandbox end-to-end readback are designed and verified.

## Verification boundaries

- `npm run check` in the web repository runs focused tests and a production
  build.
- `npm run check` in the backend runs focused tests and strict TypeScript
  compilation.
- These commands do not prove live Clerk, Convex, Gemini, source extraction,
  billing, deployment, or rendered UI behavior. Each needs its matching live or
  visual readback before release claims.

## Known architecture gaps

- No durable job queue for long or retryable extraction.
- In-memory aggregation/deduplication is process-local.
- General URL fetching does not yet have a complete SSRF/resource-control
  boundary.
- Search lacks a fixed evaluation corpus and measurable ranking contract.
- Chat tool execution lacks a fully specified idempotency/result model.
- The web code still carries migration-era retired-provider modules and duplicated
  landing components that need deliberate removal or consolidation.

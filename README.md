# DoryAI web app

The DoryAI web product: Next.js UI, Clerk authentication, and Convex data/actions
for saving, organizing, searching, and chatting with a personal link library.

The GitHub repository retains the historical `clippo-link` name. DoryAI is the
current product name.

## Stack

- Next.js 16 and React 18
- TypeScript and Tailwind CSS
- Clerk authentication
- Convex database, actions, storage, and billing state
- A separate Express/Gemini service at `../backend`

## Local setup

Requirements: a current Node.js LTS release, npm, a Clerk application, a Convex
deployment, and the DoryAI backend.

```sh
npm install
cp .env.example .env.local
npx convex dev
npm run dev
```

Fill `.env.local` before starting Next.js. Never commit real values.

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_REDACTED
NEXT_PUBLIC_CONVEX_URL=https://replace-me.convex.cloud
CLERK_SECRET_KEY=pk_test_REDACTED
```

Set `SITE_URL` to the canonical HTTPS origin only in an intended production
environment. Vercel's production URL is used when available; local and Preview
builds remain `noindex` by default.

The connected Vercel project currently runs
`npx convex deploy --cmd 'npm run build'`. Each deployment environment therefore
needs its own valid Convex deployment configuration, such as a scoped
`CONVEX_DEPLOY_KEY`. Do not copy a production deploy key into Preview merely to
make a build pass.

Set the server-only Convex environment separately:

```sh
npx convex env set BACKEND_URL http://localhost:3000
npx convex env set CONVEX_BACKEND_SECRET replace-with-a-shared-random-secret
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://replace-me.clerk.accounts.dev
```

`LEMON_WEBHOOK_SIGNING_SECRET` is additionally required to exercise the current
Lemon Squeezy webhook. Billing is under review; do not change production billing
or subscriber state from local setup.

The retired-provider variables and SDK referenced by `scripts/migrate.ts` are retained
only for the one-off retired-provider-to-Convex migration. retired-provider is not part of the
application runtime or authentication flow.

## Commands

```sh
npm run dev
npm run test
npm run build
npm run check
npm run start
```

`npm run check` runs focused Vitest coverage and the production build.

## Architecture boundary

Authenticated browser calls go to Convex. The `convex/ai.ts` action forwards a
user-bound request to the backend with `CONVEX_BACKEND_SECRET`; the backend uses
the same secret for privileged Convex operations. Never expose this shared
secret through a `NEXT_PUBLIC_*` variable or weaken the checks for development.

## Verification

```sh
npm run build
```

A passing build verifies compilation and static generation only. It does not
prove authentication, live Convex/backend communication, billing, deployment,
or the rendered desktop/mobile experience.

## Publication

Repository visibility, license selection, production deployment, and billing
changes require explicit owner approval plus secret/history and release
readbacks.

# Contributing to the DoryAI web app

DoryAI is licensed under AGPL-3.0-only. The repository remains private only
while the approved history cleanup and final publication checks are completed.

## Development flow

1. Branch from the current integration branch.
2. Keep one behavioral change per commit when practical.
3. Add or update focused tests for changed behavior.
4. Run `npm run check` before requesting review.
5. For UI changes, include desktop and mobile-width evidence and verify keyboard
   and screen-reader basics for the changed path.

Never commit `.env.local`, Clerk/Convex/billing configuration, user link content,
production exports, or screenshots containing private data. Use synthetic
fixtures and placeholder environment values.

## Pull request evidence

Include the exact commands run and their results. A Next.js build does not prove
authentication, Convex/backend behavior, billing, deployment, or rendered UI;
include those readbacks only when they were actually performed.

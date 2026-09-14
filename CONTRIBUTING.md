# Contributing to the DoryAI web app

The repository is private and unlicensed while its open-source release is being
prepared. Contributions are currently accepted only from explicitly authorized
collaborators.

## Development flow

1. Branch from the current integration branch.
2. Keep one behavioral change per commit when practical.
3. Add or update focused tests for changed behavior once the web test harness is
   established.
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

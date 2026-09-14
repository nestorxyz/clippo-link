# Open-source readiness checklist

This checklist prepares the repository; it does not authorize making it public.

## Completed on 2026-09-14

- [x] Replaced stale Lovable/Vite instructions with the current Next.js,
      Clerk, Convex, and backend setup.
- [x] Added a secret-safe `.env.example`.
- [x] Added a build-based `npm run check` command and CI definition.
- [x] Added contributor and security guidance.
- [x] Current changed-file credential-pattern scan found no credential-shaped
      values.
- [x] Bounded Git-history string scan found no credential-shaped values; its
      only service-role match is the new placeholder example.

## Required before public visibility

- [ ] Choose and approve an open-source license.
- [ ] Add focused web tests for auth-independent logic and critical UI behavior.
- [ ] Run a dedicated full-history secret scanner and resolve every finding.
- [ ] Review dependency licenses, fonts, screenshots, generated assets, and
      third-party branding rights.
- [ ] Remove or document legacy retired-provider migration code and duplicate landing
      components.
- [ ] Replace hard-coded billing product URLs/IDs with a reviewed configuration
      boundary before the provider migration.
- [ ] Enable private vulnerability reporting and appropriate branch protection.
- [ ] Confirm CI and the documented setup from a clean clone.
- [ ] Obtain explicit approval to change visibility, then verify GitHub's public
      readback and clone/setup flow.

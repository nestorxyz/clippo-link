# Open-source readiness checklist

This checklist prepares the repository; it does not authorize making it public.

## Completed on 2026-09-14

- [x] Replaced stale Lovable/Vite instructions with the current Next.js,
      Clerk, Convex, and backend setup.
- [x] Added a secret-safe `.env.example`.
- [x] Added focused billing-boundary tests, an `npm run check` command, and CI.
- [x] Added contributor and security guidance.
- [x] Current changed-file credential-pattern scan found no credential-shaped
      values.
- [x] Bounded Git-history string scan found no credential-shaped values; its
      only service-role match is the new placeholder example.
- [x] `npm audit --audit-level=low` reports zero known vulnerabilities.
- [x] Direct dependency manifests expose only MIT, Apache-2.0, BSD-2-Clause, or
      ISC licenses; detailed evidence is in `docs/DEPENDENCY_REVIEW.md`.
- [x] Dedicated Gitleaks full-history scan completed with redacted output; the
      sanitized review is in `docs/SECURITY_HISTORY_REVIEW.md`.

## Required before public visibility

- [ ] Choose and approve an open-source license.
- [ ] Extend focused web tests to critical onboarding, chat, and link-management
      behavior.
- [ ] Remove the retired provider reference from Git history and rerun Gitleaks
      to zero unresolved findings.
- [ ] Review transitive dependency licenses, fonts, screenshots, generated
      assets, and third-party branding rights.
- [x] Remove retired migration code and duplicate landing components.
- [ ] Replace hard-coded billing product URLs/IDs with a reviewed configuration
      boundary before the provider migration.
- [ ] Enable private vulnerability reporting and appropriate branch protection.
- [ ] Confirm CI and the documented setup from a clean clone.
- [x] Owner approved public visibility on 2026-09-15.
- [ ] Verify GitHub's public readback and clean-clone setup flow.

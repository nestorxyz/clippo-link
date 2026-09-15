# Git-history secret review

Scan date: 2026-09-14
Tool: Gitleaks `8.30.1`, default rules, full Git history, secrets fully redacted

## Findings

### Synthetic CI placeholder

- Rule: `generic-api-key`
- Commit: `4c2add6941f2637d852d0e913dd4f3551ed41e0c`
- File: `.github/workflows/ci.yml`, line 16
- Disposition: verified synthetic Clerk placeholder; ignored by exact Gitleaks
  fingerprint in `.gitleaksignore`.

### Historical retired-provider anon JWT

- Rule: `jwt`
- Commit: `2075b10c938575444c0e03850a34c7635a044b41`
- File: `src/integrations/retired-provider/client.ts`, line 6
- Sanitized inspection: one JWT; `role=anon`; issuer and project reference are
  present; expiry is in 2035. No token, issuer, or project reference is recorded
  here.
- Current tree: the legacy retired-provider auth route and runtime modules have been
  removed. The one-off migration script still reads service credentials from
  environment variables; deleting current files does not remove the historical
  token from Git history.
- Cross-repository evidence: the backend history contains the same historical
  anon JWT in its old `.env.example`.

## Required disposition before publication

1. Identify the retired-provider project privately and verify whether it still exists.
2. If it exists, inspect row-level security and rotate the anon key, or
   deliberately decommission the project. These are external account actions
   requiring owner approval.
3. Decide whether a history rewrite is needed after the key is unusable. A
   rewrite is disruptive and requires separate approval and coordination.
4. Rerun Gitleaks across all refs and require zero unresolved findings before
   changing repository visibility.

The repository must remain private while this finding is unresolved.

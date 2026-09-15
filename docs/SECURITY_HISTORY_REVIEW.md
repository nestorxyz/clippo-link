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

### Historical retired-provider anonymous JWT

- Rule: `jwt`
- Commit: `2075b10c938575444c0e03850a34c7635a044b41`
- File: a removed integration client, line 6
- Sanitized inspection: one JWT; `role=anon`; issuer and project reference are
  present; expiry is in 2035. No token, issuer, or project reference is recorded
  here.
- Current tree: the retired integration, migration script, dependency, examples,
  comments, and environment keys have been removed. This does not remove the
  historical token from Git history.
- Cross-repository evidence: the backend history contains the same historical
  anonymous JWT in an old environment example.

## Required disposition before publication

1. The owner confirmed on 2026-09-15 that the old project/key is no longer used.
2. Obtain explicit approval for the disruptive history rewrite and coordinated
   force-push.
3. Rerun Gitleaks across all refs and require zero unresolved findings before
   changing repository visibility.

The repository must remain private while this finding is unresolved.

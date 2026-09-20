# Publication rights review

Reviewed: 2026-09-15

This is an engineering inventory, not legal advice.

## Dependency evidence

The production dependency tree contains 342 external package/version entries.
Most are MIT, ISC, Apache-2.0, or BSD licensed. Items needing notice-aware
distribution review are Sharp's optional libvips packages (LGPL-3.0-or-later)
and `caniuse-lite` data (CC-BY-4.0). Public source publication does not include
`node_modules`; any distributed server bundle must preserve the notices its
included packages require. `npm audit --omit=dev --audit-level=low` reports zero
known vulnerabilities.

## Repository assets

On 2026-09-19 the owner confirmed DoryAI owns the publication rights for:

- `public/isologo-black.png`, `public/isologo.png`, and `public/logo.png`
- `public/product.png`
- the four images under `public/landing/`
- generated app icons and favicons under `public/` and `src/app/`

The app loads Inter through Next.js font tooling. Its upstream license and any
required notice should remain available in distributed artifacts.

## Release gate

The owner selected AGPL-3.0-only on 2026-09-19. Do not change repository
visibility until the full-history credential finding is resolved and the clean
public-clone readback passes.

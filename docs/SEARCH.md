# Saved-link search V2 (development)

This design is implemented locally and in the Convex development deployment.
It is not a production release. The corresponding backend changes must be
deployed together with these Convex functions; the browser cards can deploy
after the backend and index are available.

## Request path

1. Every link create, edit, registration, and content enrichment refreshes a
   bounded, accent-folded `searchText` projection in Convex. It combines title,
   description, source, URL, and saved content. Taxonomy stays in its own
   current records and is filtered separately, so tag/category renames cannot
   leave stale terms in the text index. Deleting a link deletes its projection.
2. The `links.by_search_text` index searches this projection with `userId` as
   an equality filter. `searchLinksForBackend` returns up to 100 candidates to
   the trusted backend, omitting `searchText` from its response. For filter-only
   searches, `listLinkMetadataForBackend` pages through the user's link
   metadata; an empty search still returns recent links.
3. Backend `retrieveLinks` applies deterministic ranking and explicit filters,
   returning at most 20 concise results. A detail question may call `get_link`
   once using an ID from those results. The backend checks that ID against the
   current result set and Convex independently verifies its `userId` before
   returning the saved content. The model must cite the saved URL and disclose
   `partial-preview` or `metadata-only` scope.
4. The chat displays up to five linked result cards with excerpts and scope
   labels. A no-match is explicit. Search does not recrawl saved URLs or call
   Firecrawl; Firecrawl remains a save-time extractor for general webpages.

## Existing-link backfill

`links:backfillSearchText` is an internal, idempotent 25-row batch mutation. A
deployment administrator must call it repeatedly with the returned cursor
until `isDone`, then verify a sample of old links and query results. It was run
only against the development deployment during implementation. **Do not run
the production backfill without explicit approval for that data migration.**
Until production backfill completes, old records lacking `searchText` will not
appear in indexed text searches. Deploying code without backfill is therefore
not a complete release.

## Evaluation and remaining work

- The sanitized backend fixture covers titles, descriptions, taxonomy,
  transcripts, Spanish preview text, URL terms, and no-answer behavior. A
  generated 251-link test proves deterministic ranking can return an older
  candidate when the index supplies it. This does not replace a live >200-link
  tenant integration test.
- Development Convex indexed all 16 existing links. A read-only tenant-scoped
  `AI` query returned seven links, and a selected detail read returned an
  825-character `partial-preview` record. These are integration checks, not an
  authenticated end-to-end chat or visual QA of result cards.
- Branch CI passed for web `195c158` and backend `1ac243c`. Railway dev
  deployment `1d7f4aa5-1b3c-457a-8f3b-6e56816822ad` reached `SUCCESS` and
  its health endpoint returned HTTP 200. Vercel Preview for the web branch
  failed at its Convex deploy step because Preview has no `CONVEX_DEPLOY_KEY`.
  Configure only a development-scoped key before retesting; never copy the
  production key into Preview.
- Before promotion, run the affected tests/builds, a live authenticated
  Preview save/search/detail test, a >200-link corpus test in an isolated test
  environment, negative/cross-tenant read tests, and a mobile-width visual
  check. Record recall@5, MRR@5, grounding, latency, and provider cost against
  a fixed evaluation set. Do not claim semantic paraphrase coverage from this
  lexical implementation; embeddings remain a separate, measurement-gated
  phase.

The existing X/LinkedIn stored-content policy risks still apply to search and
chat copies of saved text. Do not present this technical work as provider
permission or legal clearance.

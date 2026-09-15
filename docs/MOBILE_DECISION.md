# DoryAI V1 mobile decision

Decision date: 2026-09-15

Decision: ship the responsive web app as an installable PWA for V1. Do not
claim an App Store, Play Store, offline, iOS share-extension, or native release.

## Evidence

- The public landing page has been inspected at 390×844 without visible
  horizontal clipping.
- The dashboard already has a mobile header, bottom navigation, safe-area
  spacing, and mobile chat/link views. The complete authenticated workflow is
  not yet visually verified because the current local Clerk keys do not match.
- The manifest has standalone display mode, stable app identity, 192×192 and
  512×512 icons, a dashboard start URL, and an inbound URL/text share target.
- The share target validates HTTP(S) input and opens an authenticated dashboard
  draft. It never saves on receipt; the user reviews and submits the message.
- Sign-in now preserves safe same-origin checkout and share destinations while
  rejecting external redirect targets.
- There is no service worker or offline data model. Saving, retrieval, and
  authentication require a network connection.

The Web Share Target manifest feature is not broadly supported. Supporting
platforms can surface the installed PWA in their share UI, but iOS share-sheet
capture is not claimed. That gap alone does not justify duplicating the whole V1
in a wrapper before the core save-and-find workflow is accepted.

## Release gate

Call the PWA released only after all of the following are observed on a deployed
HTTPS Preview or production candidate:

- the browser recognizes the manifest and icons;
- installation opens in standalone mode at `/dashboard`;
- a fresh approved account completes save then retrieval at a mobile viewport;
- on a platform that supports Web Share Target, sharing a URL opens a populated
  draft and requires explicit submission;
- unsupported platforms retain a clear paste-a-link workflow;
- online loss during a request produces the existing retry UI and no duplicate
  link;
- the final Privacy and Terms copy matches the selected billing provider and
  mobile behavior.

## Native reconsideration rule

Reconsider a native iOS/Android client or share extension only after responsive
V1 evidence shows a material activation or retention failure caused by a
platform capability that the PWA cannot provide. A native proposal must then
define platform priority, share-extension data flow, Clerk/Convex authentication,
offline and retry semantics, privacy disclosures, device tests, signing, store
review, support, and migration ownership before implementation.

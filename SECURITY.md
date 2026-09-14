# Security policy

## Reporting

Do not disclose a suspected vulnerability in a public issue. Use GitHub private
vulnerability reporting if it is enabled; otherwise contact the repository owner
through an existing trusted private channel.

Include the affected revision, impact, minimal reproduction, and whether any
credential or user data may have been exposed. Do not include live secrets or
private user content in the report.

## Security boundaries

- Only values deliberately prefixed `NEXT_PUBLIC_` may reach browser bundles.
- `CLERK_SECRET_KEY`, `CONVEX_BACKEND_SECRET`, billing webhook secrets, migration
  service keys, and production data are server-only.
- Authenticated browser operations must remain user-scoped in Convex.
- Billing webhooks require signature validation and idempotent processing.
- Links rendered from chat or saved content must not gain script execution or
  unsafe navigation behavior.

Repository publication requires an approved license and a dedicated full-history
secret scan. The current bounded string scan is not a substitute.

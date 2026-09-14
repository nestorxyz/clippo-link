# Direct dependency license and security review

Observed from the installed lockfile on 2026-09-14.

## Security

- `npm audit --audit-level=low`: zero known vulnerabilities after removing
  unused direct packages and updating patched Next.js/Clerk/transitive versions.
- Removed as unused: `@ai-sdk/google`, `@auth/core`, `@google/genai`,
  `@tanstack/react-query`, `@types/react-router-dom`, `ai`, and
  `react-router-dom`.
- Current critical framework/auth versions: Next.js `16.3.5`, Clerk Next.js
  `6.39.6`.

## Direct package licenses

Every installed direct dependency/devDependency exposed a license in its package
manifest. The observed licenses are permissive:

- Apache-2.0: `class-variance-authority`, `convex`, `typescript`.
- BSD-2-Clause: `dotenv`.
- ISC: `lucide-react`.
- MIT: all other direct dependencies and devDependencies.

This is not legal advice and is not the complete publication review. Before the
repository becomes public, review transitive packages, copied/generated code,
fonts, screenshots, icons, logos, demo content, and other third-party assets;
preserve required notices and obtain the owner's DoryAI license choice.

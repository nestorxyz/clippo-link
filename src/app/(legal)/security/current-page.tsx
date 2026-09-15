import { NavigationHeader } from '../../_components/sections/navigation';

export function CurrentSecurityPage() {
  return (
    <>
      <NavigationHeader />
      <main className="min-h-screen bg-white text-black">
        <article className="prose prose-neutral mx-auto max-w-4xl px-6 py-10 lg:py-14">
          <header className="mb-10">
            <h1>Security at DoryAI</h1>
            <p className="text-sm text-gray-500">Reviewed September 15, 2026</p>
            <p>
              This page describes safeguards visible in the current DoryAI
              system. It does not claim a certification, independent audit, or
              security guarantee.
            </p>
          </header>

          <h2>Current security boundaries</h2>
          <ul>
            <li>Clerk authenticates users before dashboard access.</li>
            <li>
              Convex operations scope saved links, categories, tags, and chat
              history to the authenticated user.
            </li>
            <li>
              Clerk secrets, the backend shared secret, and webhook signing
              secrets remain on the server.
            </li>
            <li>
              Convex-to-backend requests require a shared server secret plus the
              intended user and chat session.
            </li>
            <li>
              General webpage and remote-image fetching rejects local and
              private network targets, rechecks redirects and DNS answers, and
              limits time, response size, and content type.
            </li>
            <li>
              URL normalization makes equivalent save retries idempotent.
            </li>
          </ul>

          <h2>External services</h2>
          <p>
            DoryAI currently relies on Clerk for authentication, Convex for app
            data and server functions, Google Gemini for AI processing, source
            websites and media tools for link metadata, and Lemon Squeezy for
            the existing billing path. Their infrastructure and data practices
            are governed by their own terms.
          </p>

          <h2>Known limitations</h2>
          <ul>
            <li>
              DoryAI has not documented an independent penetration test,
              security certification, or formal 24-hour monitoring program.
            </li>
            <li>
              The product does not provide end-to-end encryption. Server-side
              processing must read submitted links and chat content to perform
              the requested work.
            </li>
            <li>
              LinkedIn and X may block extraction. DoryAI records a limited,
              labeled result instead of claiming unavailable post content.
            </li>
            <li>
              The implementation repositories remain private while a known
              historical credential finding and license decision are resolved.
            </li>
          </ul>

          <h2>Your controls</h2>
          <p>
            You can delete individual saved links and clear chat history in the
            app. The current product does not claim a self-service account
            export or complete account-deletion workflow.
          </p>

          <h2>Report a vulnerability</h2>
          <p>
            Do not publish suspected vulnerabilities or private user data in a
            public issue. Send the affected revision, impact, and a minimal
            reproduction to{' '}
            <a href="mailto:nmamanipantoja@gmail.com">
              nmamanipantoja@gmail.com
            </a>
            . Never include live credentials in the report.
          </p>
        </article>
      </main>
    </>
  );
}

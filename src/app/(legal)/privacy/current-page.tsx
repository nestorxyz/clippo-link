import Link from 'next/link';
import { NavigationHeader } from '../../_components/sections/navigation';

export function CurrentPrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <NavigationHeader />
      <article className="prose prose-neutral mx-auto max-w-4xl px-6 py-10 lg:py-14">
        <header className="mb-10">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last revised: September 15, 2026</p>
          <p>
            This policy describes data flows implemented by the current DoryAI
            link assistant. It avoids promises about controls or compliance
            programs that are not implemented or verified.
          </p>
        </header>

        <h2>Information DoryAI processes</h2>
        <ul>
          <li>
            Account identity supplied through Clerk, such as your user ID,
            email address, name, and profile image when available.
          </li>
          <li>
            Links you submit, extracted metadata, generated descriptions,
            categories, subcategories, tags, and preview images.
          </li>
          <li>
            Chat messages and tool results needed to save, organize, and find
            your links.
          </li>
          <li>
            Plan, usage, and subscription-event state needed to enforce limits
            and process the current Lemon Squeezy billing flow.
          </li>
          <li>
            Limited operational errors. Routine application logs are designed
            not to include full conversations, extraction payloads, or
            transcripts.
          </li>
        </ul>

        <h2>How information is used</h2>
        <p>
          DoryAI uses this information to authenticate you, analyze submitted
          links, organize and retrieve saved material, maintain chat history,
          prevent duplicate saves, enforce plan limits, and respond to support
          or security requests.
        </p>

        <h2>External processing</h2>
        <ul>
          <li>Clerk provides authentication.</li>
          <li>Convex stores application data and runs server functions.</li>
          <li>
            Google Gemini receives chat context and link information needed to
            answer a request. For supported YouTube links, this may include
            public caption text.
          </li>
          <li>
            Source websites and media tools are contacted for public metadata or
            captions for a link you submit.
          </li>
          <li>
            Lemon Squeezy handles the current checkout and subscription-event
            flow when you choose a paid plan.
          </li>
        </ul>
        <p>
          Those providers may process request, account, billing, or network data
          under their own terms and retention practices. DoryAI does not claim
          that provider-side processing is end-to-end encrypted or retained for
          a fixed period.
        </p>

        <h2>AI training and advertising</h2>
        <p>
          The DoryAI application code does not train its own model and contains
          no product advertising or behavioral-analytics integration in the
          current revision. Content sent to external providers is subject to the
          agreements and settings of the accounts used to operate them; this
          policy does not make a broader promise on their behalf.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          Saved links, organization data, and chat history remain in Convex so
          the product can retrieve them later. You can delete individual links
          and clear chat history in the app. Provider backups, logs, and billing
          records may follow separate retention requirements. DoryAI has not yet
          published a verified fixed retention schedule or self-service complete
          account deletion/export flow.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Do not submit a link or message you do not want processed.</li>
          <li>Delete saved links or clear chat history in the app.</li>
          <li>Sign out to end the current authenticated session.</li>
          <li>
            Request access, correction, or account-level deletion using the
            contact address below. Requests may require identity verification.
          </li>
        </ul>

        <h2>Security</h2>
        <p>
          DoryAI uses authenticated, user-scoped data operations and server-only
          secrets at privileged boundaries. Current safeguards and limitations
          are described on the <Link href="/security">Security page</Link>. No
          internet service can guarantee absolute security.
        </p>

        <h2>International processing</h2>
        <p>
          The external services listed above may process data in countries
          different from yours. Their locations and transfer mechanisms are
          governed by their service terms. DoryAI does not currently claim a
          specific regulatory certification on this page.
        </p>

        <h2>Changes and contact</h2>
        <p>
          Material changes will be reflected by updating the revision date.
          Questions and account or privacy requests can be sent to{' '}
          <a href="mailto:nmamanipantoja@gmail.com">
            nmamanipantoja@gmail.com
          </a>
          .
        </p>
      </article>
    </main>
  );
}

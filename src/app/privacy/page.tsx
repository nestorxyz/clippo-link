/* eslint-disable react-refresh/only-export-components */
import Link from 'next/link';
import { NavigationHeader } from '../_components/sections/navigation';

export const metadata = {
  title: 'Privacy Policy • DoryAI',
  description:
    'DoryAI Privacy Policy — how we collect, use, and protect your information. We never sell your data or train AI on your personal content.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <NavigationHeader />
      <section className="container mx-auto text-black px-6 py-10 lg:py-14 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Revised: August 13, 2025
          </p>
        </header>

        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-8">
          We are strongly committed to protecting your personal information and
          your right to privacy. This Privacy Policy explains how DoryAI ("we,"
          "our," or "us") collects, uses, and protects your information when you
          use our AI-powered link organization assistant.
        </p>

        {/* Core Principles */}
        <section aria-labelledby="principles" className="mb-10">
          <h2 id="principles" className="text-xl font-medium mb-4">
            Our Core Privacy Principles
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>We only access your data when you explicitly request it</li>
            <li>We never sell your data or use it for advertising</li>
            <li>We don&apos;t train AI models on your personal information</li>
            <li>Saved links and summaries are processed securely</li>
            <li>You maintain complete control over your data</li>
          </ul>
        </section>

        {/* Table of Contents */}
        <section aria-labelledby="toc" className="mb-10">
          <h2 id="toc" className="text-xl font-medium mb-4">
            Table of Contents
          </h2>
          <ol className="pl-6 space-y-2 text-blue-600">
            <li>
              <Link href="#s1" className="hover:underline">
                1. Collection of Your Information
              </Link>
            </li>
            <li>
              <Link href="#s2" className="hover:underline">
                2. Data We Access
              </Link>
            </li>
            <li>
              <Link href="#s3" className="hover:underline">
                3. Use of Your Information
              </Link>
            </li>
            <li>
              <Link href="#s4" className="hover:underline">
                4. Data Sharing and Disclosure
              </Link>
            </li>
            <li>
              <Link href="#s5" className="hover:underline">
                5. Data Protection and Security
              </Link>
            </li>
            <li>
              <Link href="#s6" className="hover:underline">
                6. Data Retention
              </Link>
            </li>
            <li>
              <Link href="#s7" className="hover:underline">
                7. User Rights and Controls
              </Link>
            </li>
            <li>
              <Link href="#s8" className="hover:underline">
                8. International Data Transfers
              </Link>
            </li>
            <li>
              <Link href="#s9" className="hover:underline">
                9. Policy Changes
              </Link>
            </li>
            <li>
              <Link href="#s10" className="hover:underline">
                10. Contact Information
              </Link>
            </li>
          </ol>
        </section>

        {/* Sections */}
        <article className="prose prose-neutral max-w-none">
          <h2 id="s1">1. Collection of Your Information</h2>
          <p>
            We collect information from and about you to provide, improve, and
            protect our services.
          </p>
          <p className="font-medium">Personal Data:</p>
          <ul>
            <li>
              Email address, name, and profile picture (from Google OAuth or
              other logins)
            </li>
            <li>Authentication tokens to keep your session secure</li>
            <li>Support contact information</li>
          </ul>
          <p className="font-medium">Derivative Data:</p>
          <ul>
            <li>Usage analytics (features used, session duration, etc.)</li>
            <li>Technical data (device, IP, browser)</li>
            <li>Saved link metadata (title, tags, notes)</li>
            <li>Anonymized error logs</li>
          </ul>

          <h2 id="s2">2. Data We Access</h2>
          <p>We only access your data when you request it, such as:</p>
          <ul>
            <li>URLs you save to DoryAI</li>
            <li>Notes or tags you add to links</li>
            <li>Metadata from saved pages (title, description, images)</li>
          </ul>
          <p className="font-medium">Data Use Restrictions:</p>
          <ul>
            <li>No AI/ML training on your personal content</li>
            <li>No advertising</li>
            <li>No third-party sharing</li>
            <li>
              No human review (unless required for support/security with
              consent)
            </li>
          </ul>
          <p className="font-medium">Your Control:</p>
          <ul>
            <li>Revoke access anytime via your account settings</li>
            <li>Data accessed only when you actively use DoryAI</li>
            <li>Permanent deletion available at your request</li>
          </ul>

          <h2 id="s3">3. Use of Your Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>
              Deliver services: save links, generate AI summaries, organize tags
              and categories
            </li>
            <li>Manage accounts: authenticate and secure your sessions</li>
            <li>
              Improve product: fix bugs, refine features, optimize AI
              performance
            </li>
            <li>
              Communicate: send support updates or important product notices
            </li>
          </ul>
          <p className="font-medium">Legal Basis:</p>
          <ul>
            <li>Consent (e.g., OAuth login)</li>
            <li>Contract performance</li>
            <li>Legitimate interest</li>
            <li>Legal obligations</li>
          </ul>

          <h2 id="s4">4. Data Sharing and Disclosure</h2>
          <p>We do not sell or trade your data. We may share with:</p>
          <p className="font-medium">Service Providers:</p>
          <ul>
            <li>Cloud infrastructure (AWS, Google Cloud, or similar)</li>
            <li>
              AI processing (OpenAI or similar, used in real time without
              storing your personal link data)
            </li>
          </ul>
          <p className="font-medium">Legal Disclosures:</p>
          <ul>
            <li>As required by law</li>
            <li>To protect safety or property</li>
            <li>In legal investigations (with notice if allowed)</li>
          </ul>
          <p className="font-medium">Business Transfers:</p>
          <ul>
            <li>
              In a merger/acquisition, with notice and data control options
            </li>
          </ul>
          <p className="font-medium">We Never:</p>
          <ul>
            <li>Sell your data</li>
            <li>Share with ad networks</li>
            <li>Use your links or notes beyond delivering the service</li>
          </ul>

          <h2 id="s5">5. Data Protection and Security</h2>
          <p className="font-medium">Technical Security:</p>
          <ul>
            <li>TLS 1.3, AES-256 encryption</li>
            <li>End-to-end encryption for sensitive operations</li>
            <li>Role-based access, MFA, least privilege</li>
            <li>Regular audits and penetration tests</li>
          </ul>
          <p className="font-medium">Organizational Security:</p>
          <ul>
            <li>Employee training and background checks</li>
            <li>24/7 security monitoring</li>
            <li>Incident response plans</li>
            <li>72-hour breach notification window</li>
          </ul>
          <p className="font-medium">Security Commitments:</p>
          <ul>
            <li>No long-term storage of deleted links</li>
            <li>
              AI processing is done in real-time without retaining your private
              data
            </li>
            <li>Regular third-party audits</li>
            <li>Secure deletion protocols</li>
          </ul>

          <h2 id="s6">6. Data Retention</h2>
          <p className="font-medium">What We Retain:</p>
          <ul>
            <li>Account data (while account is active)</li>
            <li>Link metadata and summaries (until you delete them)</li>
            <li>Anonymized analytics (90 days)</li>
            <li>Support emails (up to 2 years)</li>
          </ul>
          <p className="font-medium">What We Don’t Store:</p>
          <ul>
            <li>Deleted links or notes</li>
            <li>Any data after permanent account deletion</li>
          </ul>
          <p className="font-medium">Data Deletion:</p>
          <ul>
            <li>Account deletion: all data removed in 30 days</li>
            <li>Selective deletion: immediate upon request</li>
            <li>
              Request via email:{' '}
              <a href="mailto:nmamanipantoja@gmail.com">
                nmamanipantoja@gmail.com
              </a>
            </li>
          </ul>

          <h2 id="s7">7. User Rights and Controls</h2>
          <p className="font-medium">Your Rights:</p>
          <ul>
            <li>Access, correct, delete, restrict processing</li>
            <li>Withdraw consent anytime</li>
            <li>Receive portable copies of your data</li>
            <li>Know who your data is shared with</li>
          </ul>
          <p>
            To exercise your rights, contact:{' '}
            <a href="mailto:nmamanipantoja@gmail.com">
              nmamanipantoja@gmail.com
            </a>
            . We’ll respond within 30 days.
          </p>

          <h2 id="s8">8. International Data Transfers</h2>
          <p>
            DoryAI operates from [Your Country]. Data may be transferred to
            other countries for processing. Safeguards include:
          </p>
          <ul>
            <li>Encryption in transit and at rest</li>
            <li>Access controls</li>
            <li>GDPR/UK GDPR compliance for EU and UK users</li>
          </ul>

          <h2 id="s9">9. Policy Changes</h2>
          <p>We may update this policy based on:</p>
          <ul>
            <li>Practice changes</li>
            <li>Feature updates</li>
            <li>Regulatory shifts</li>
            <li>User feedback</li>
          </ul>
          <p>
            When we update: we update the “Last Revised” date and notify users
            by email (if significant).
          </p>

          <h2 id="s10">10. Contact Information</h2>
          <p className="font-medium">
            General Inquiries &amp; Privacy Requests:
          </p>
          <ul>
            <li>
              Email:{' '}
              <a href="mailto:nmamanipantoja@gmail.com">
                nmamanipantoja@gmail.com
              </a>
            </li>
            <li>Response Time: Within 2 business days</li>
          </ul>
          <p className="font-medium">Legal Entity:</p>
          <ul>
            <li>Company: Misfit Labs</li>
            <li>Product Name: DoryAI</li>
            <li>
              Website:{' '}
              <a href="https://doryai.app" target="_blank" rel="noreferrer">
                doryai.app
              </a>
            </li>
          </ul>
        </article>

        {/* Back to top */}
        <div className="mt-10">
          <Link href="#" className="text-sm text-blue-600 hover:underline">
            Back to top
          </Link>
        </div>
      </section>
    </main>
  );
}

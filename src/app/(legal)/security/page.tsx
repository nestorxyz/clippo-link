/* eslint-disable react-refresh/only-export-components */
import { NavigationHeader } from '../../_components/sections/navigation';

export const metadata = {
  title: 'Security & Privacy • DoryAI',
  description:
    'Learn how DoryAI protects your data: encryption, access controls, audits, and user control over data.',
};

export default function SecurityPage() {
  return (
    <>
      <NavigationHeader />
      <main className="min-h-screen bg-white text-black">
        <section className="container mx-auto px-6 py-10 lg:py-14 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Security &amp; Privacy at DoryAI
            </h1>
            <p className="text-gray-700 mt-2">
              Your trust is our highest priority.
            </p>
          </header>

          <p className="text-gray-700 leading-relaxed mb-6">
            At DoryAI, safeguarding your data is fundamental to everything we
            do. As your AI-powered link assistant, DoryAI helps you save, tag,
            and organize links—without ever compromising your privacy.
          </p>
          <p className="text-gray-700 leading-relaxed mb-10">
            We follow industry best practices for authentication, encryption,
            and access control, and we undergo regular third-party security
            reviews to ensure your data is handled with the highest standards of
            confidentiality and integrity.
          </p>

          <article className="prose prose-neutral max-w-none">
            <h2 id="s1">1. Compliance &amp; Standards</h2>
            <p>
              We align with globally recognized security and privacy standards
              to give you complete confidence:
            </p>
            <ul>
              <li>
                <strong>Secure OAuth authentication</strong> – We integrate with
                trusted providers like Google for secure login and account
                access.
              </li>
              <li>
                <strong>Encryption in transit and at rest</strong> – All data is
                protected using TLS 1.3 and AES-256 encryption.
              </li>
              <li>
                <strong>Regular security audits</strong> – We work with
                independent security experts to test our systems and close
                vulnerabilities.
              </li>
            </ul>

            <h2 id="s2">2. Data Access &amp; Usage Principles</h2>
            <p>
              We believe in minimum necessary access — DoryAI only processes the
              information required to deliver the features you use.
            </p>
            <ul>
              <li>
                <strong>You control what we can access</strong> – We only
                process the links, tags, and notes you choose to save.
              </li>
              <li>
                <strong>No AI model training</strong> – Your personal data is
                never used to train DoryAI or any third-party AI models.
              </li>
              <li>
                <strong>Your data, your rules</strong> – Delete links anytime,
                or delete your entire account and all stored data.
              </li>
              <li>
                <strong>Immediate revocation</strong> – You can disconnect your
                login provider (e.g., Google) at any time via your account
                settings.
              </li>
            </ul>

            <h2 id="s3">3. Infrastructure &amp; Security Measures</h2>
            <p>
              We operate on a secure, redundant, and continuously monitored
              infrastructure:
            </p>
            <ul>
              <li>
                <strong>24/7 Security Monitoring</strong> – Our systems are
                monitored around the clock for suspicious activity.
              </li>
              <li>
                <strong>Encryption Everywhere</strong> – All data is encrypted
                both in transit (TLS 1.3) and at rest (AES-256).
              </li>
              <li>
                <strong>Minimal Data Retention</strong> – We avoid long-term
                storage of sensitive content wherever possible.
              </li>
              <li>
                <strong>Regular Penetration Testing</strong> – Independent
                security experts test our systems for vulnerabilities.
              </li>
              <li>
                <strong>Zero Trust Security Model</strong> – Every connection is
                verified, and access is restricted to the least privilege
                necessary.
              </li>
            </ul>

            <h2 id="s4">4. Transparency &amp; User Rights</h2>
            <p>
              We are committed to clear, transparent, and user-friendly security
              policies:
            </p>
            <ul>
              <li>
                <strong>Clear Privacy Policy</strong> – Written in plain
                language so you can understand exactly what happens to your
                data.
              </li>
              <li>
                <strong>Full Data Portability &amp; Deletion</strong> – Export
                your saved links anytime, or request complete account deletion.
              </li>
              <li>
                <strong>Audit &amp; Governance</strong> – We maintain documented
                Business Continuity, Disaster Recovery, Encryption, and Incident
                Response policies.
              </li>
            </ul>

            <h2 id="s5">5. Your Control, Always</h2>
            <ul>
              <li>
                <strong>Opt-in Features Only</strong> – Nothing is enabled
                without your explicit permission.
              </li>
              <li>
                <strong>Reversible at Any Time</strong> – Disconnect DoryAI from
                your accounts instantly.
              </li>
              <li>
                <strong>No Hidden Access</strong> – We never request or store
                permissions we don’t need.
              </li>
            </ul>

            <h2 id="summary">Summary</h2>
            <p>
              Security is not an afterthought at DoryAI — it’s part of our
              foundation. From strict encryption standards to transparent
              privacy practices, we take every measure to protect your data. You
              remain in control of what DoryAI can access, and we’re transparent
              about how your information is stored, processed, and secured.
            </p>

            <h2 id="contact">Questions?</h2>
            <p>
              If you have any questions about our security practices, please
              contact us:{' '}
              <a href="mailto:nmamanipantoja@gmail.com">
                nmamanipantoja@gmail.com
              </a>
            </p>
          </article>
        </section>
      </main>
    </>
  );
}

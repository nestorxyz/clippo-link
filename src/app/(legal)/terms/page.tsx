/* eslint-disable react-refresh/only-export-components */
import { NavigationHeader } from '../../_components/sections/navigation';

export const metadata = {
  title: 'Terms of Service • DoryAI',
  description:
    'DoryAI Terms of Service — the legal terms governing your use of our AI-powered link assistant.',
};

export default function TermsPage() {
  return (
    <>
      <NavigationHeader />
      <main className="min-h-screen bg-white text-black">
        <section className="container mx-auto px-6 py-10 lg:py-14 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Last Revised: August 13, 2025
            </p>
          </header>

          <article className="prose prose-neutral max-w-none">
            <h2 id="s1">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (“Terms”) constitute a legally binding
              agreement between you and Misfit Labs, doing business as DoryAI
              (“we,” “us,” or “our”). By accessing or using DoryAI’s AI-powered
              link assistant service (the “Platform”), you agree to be bound by
              these Terms.
            </p>
            <p>
              If you do not agree to these Terms, you may not access or use the
              Platform. You represent that you have the legal authority to enter
              into this agreement, and if acting on behalf of an organization,
              you have authority to bind that organization to these Terms.
            </p>

            <h2 id="s2">2. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of any material changes by updating the “Last Revised”
              date and, where appropriate, providing additional notice through
              the Platform or via email.
            </p>
            <p>
              Your continued use of the Platform after any modifications
              constitutes acceptance of the updated Terms. If you do not agree
              to the modifications, you must discontinue use of the Platform.
            </p>

            <h2 id="s3">3. Access and Use of Platform</h2>
            <h3 id="s3-1">3.1 License Grant</h3>
            <p>
              Subject to your compliance with these Terms, we grant you a
              limited, non-exclusive, non-transferable, and revocable license to
              access and use the Platform for your personal or internal business
              purposes.
            </p>
            <h3 id="s3-2">3.2 Account Requirements</h3>
            <p>
              To use the Platform, you must create an account (via email, OAuth
              login, or other supported authentication). You are responsible for
              maintaining the security of your account and all activities that
              occur under it.
            </p>
            <h3 id="s3-3">3.3 Usage Restrictions</h3>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the Platform for any unlawful purpose or in violation of
                applicable laws
              </li>
              <li>Interfere with or disrupt the Platform’s operation</li>
              <li>
                Attempt to gain unauthorized access to the Platform or related
                systems
              </li>
              <li>
                Reverse engineer, decompile, or otherwise attempt to extract
                source code
              </li>
              <li>
                Use the Platform to develop competing products or services
              </li>
              <li>Violate the rights of any third party</li>
            </ul>

            <h2 id="s4">4. Data Access and Integrations</h2>
            <h3 id="s4-1">4.1 Scope of Access</h3>
            <p>
              When you save links or content to DoryAI, you grant us access to
              process that data to deliver the requested functionality. This may
              include retrieving webpage metadata, generating summaries, or
              organizing tags and categories.
            </p>
            <h3 id="s4-2">4.2 Data Use Restrictions</h3>
            <p>
              We only use your data to provide the functionality you request. We
              do not:
            </p>
            <ul>
              <li>Sell or rent your data</li>
              <li>Use your data for advertising purposes</li>
              <li>
                Train AI models on your personal information outside of
                improving the Platform’s direct functionality
              </li>
              <li>
                Allow human review of your saved data unless necessary for
                support/security with your explicit consent
              </li>
            </ul>
            <h3 id="s4-3">4.3 Revocation Rights</h3>
            <p>
              You may delete your account and request deletion of your data at
              any time via your account settings or by contacting us.
            </p>

            <h2 id="s5">5. User Responsibilities</h2>
            <h3 id="s5-1">5.1 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality and
              security of your account. Notify us immediately of any
              unauthorized use of your account or any other breach of security.
            </p>
            <h3 id="s5-2">5.2 Compliance with Laws</h3>
            <p>
              You agree to use the Platform in compliance with all applicable
              laws, regulations, and these Terms.
            </p>
            <h3 id="s5-3">5.3 Data Accuracy</h3>
            <p>
              You are responsible for the accuracy of the content and links you
              save. DoryAI is not liable for incomplete, outdated, or inaccurate
              metadata retrieved from third-party websites.
            </p>

            <h2 id="s6">6. User-Generated Content</h2>
            <h3 id="s6-1">6.1 Content Ownership</h3>
            <p>
              You retain ownership of all data, content, and information you
              provide to or process through the Platform (“User Content”).
            </p>
            <h3 id="s6-2">6.2 License Grant</h3>
            <p>
              You grant us a limited, non-exclusive license to access, process,
              and transmit your User Content solely to provide the functionality
              you request. This license terminates when you delete your content
              or terminate your account.
            </p>
            <h3 id="s6-3">6.3 Content Restrictions</h3>
            <p>You represent and warrant that your User Content:</p>
            <ul>
              <li>Does not violate any laws or third-party rights</li>
              <li>Does not contain malicious code or harmful materials</li>
              <li>Is appropriate for the intended use of the Platform</li>
            </ul>
            <h3 id="s6-4">6.4 AI/ML Training Restrictions</h3>
            <p>
              We do not use your User Content to train machine learning models
              outside of improving DoryAI’s direct functionality.
            </p>

            <h2 id="s7">7. Termination of Access</h2>
            <h3 id="s7-1">7.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by discontinuing use of
              the Platform.
            </p>
            <h3 id="s7-2">7.2 Termination by Us</h3>
            <p>
              We may suspend or terminate your access if you violate these
              Terms, engage in prohibited activities, or if necessary to protect
              the Platform, our users, or comply with legal requirements.
            </p>
            <h3 id="s7-3">7.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to access the Platform ceases
              immediately. We will delete your account data in accordance with
              our Privacy Policy.
            </p>

            <h2 id="s8">8. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided “as is” and “as available” without
              warranties of any kind, whether express, implied, or statutory. We
              disclaim all warranties, including but not limited to
              merchantability, fitness for a particular purpose,
              non-infringement, and title.
            </p>
            <p>
              We do not guarantee uninterrupted or error-free service, nor do we
              guarantee the accuracy of metadata, summaries, or tags generated
              from third-party websites.
            </p>

            <h2 id="s9">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, our total liability for
              all claims arising from or relating to the Platform shall not
              exceed the amount you paid for the Platform in the twelve months
              preceding the claim, or $100 if no fees were paid.
            </p>
            <p>
              We shall not be liable for any indirect, incidental, special,
              consequential, punitive, or exemplary damages, including loss of
              profits, data, or goodwill.
            </p>

            <h2 id="s10">10. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the State of Delaware, United States, without regard to
              conflict of law principles.
            </p>
            <p>
              Any disputes will be resolved in the state or federal courts
              located in Delaware, and you consent to their jurisdiction.
            </p>

            <h2 id="s11">11. Contact Information</h2>
            <p>If you have questions about these Terms, contact us:</p>
            <ul>
              <li>Email: nmamanipantoja@gmail.com</li>
              <li>Response Time: Within 2 business days</li>
              <li>Company: Misfit Labs</li>
              <li>Product: DoryAI</li>
              <li>Website: doryai.app</li>
            </ul>
          </article>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy • DoryAI',
  description:
    'What data the current DoryAI product processes and the controls available to users.',
  alternates: { canonical: '/privacy' },
};

export { CurrentPrivacyPage as default } from './current-page';

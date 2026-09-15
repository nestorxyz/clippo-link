import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security • DoryAI',
  description:
    'The current security boundaries and known limitations of the DoryAI link assistant.',
  alternates: { canonical: '/security' },
};

export { CurrentSecurityPage as default } from './current-page';

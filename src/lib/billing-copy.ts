export type PaidPlanKey = 'monthly' | 'annual';

export type PaidPlanCopy = {
  key: PaidPlanKey;
  title: string;
  price: string;
  originalPrice?: string;
  billing: string;
  description: string;
  featuresTitle: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

export const PAID_PLAN_COPY: readonly PaidPlanCopy[] = [
  {
    key: 'monthly',
    title: 'Monthly',
    price: '$4.99',
    billing: 'per month',
    description:
      'Pay month to month for DoryAI’s current save, organize, and search experience.',
    featuresTitle: 'Included:',
    features: [
      'Save and organize useful links',
      'AI-assisted tagging and retrieval',
      'Use DoryAI in your web browser',
      'Manage or cancel your subscription',
    ],
    cta: 'Continue to checkout',
  },
  {
    key: 'annual',
    title: 'Annual',
    price: '$34.99',
    originalPrice: '$59.88',
    billing: 'per year — $24.89 less than twelve monthly payments',
    description:
      'The same DoryAI access, billed once per year at the lower annual price.',
    featuresTitle: 'Included:',
    features: [
      'The same product access as monthly',
      'One annual payment',
      'Trial and renewal terms shown before payment',
      'Manage or cancel your subscription',
    ],
    cta: 'Continue to checkout',
    popular: true,
  },
];

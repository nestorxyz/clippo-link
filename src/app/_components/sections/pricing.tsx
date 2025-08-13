'use client';

import { Check } from 'lucide-react';

interface PricingPlan {
  title: string;
  price: string;
  originalPrice?: string;
  billing: string;
  isPopular?: boolean;
  features: string[];
}

export const PricingSection = () => {
  const plans: PricingPlan[] = [
    {
      title: 'Monthly Plan',
      price: '$29.00',
      billing: 'per month',
      features: [
        'Unlimited email processing',
        'Voice command integration',
        'AI-powered summaries',
        'AirPods & CarPlay support',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      title: 'Annual Plan',
      price: '$199.00',
      originalPrice: '$249.99',
      billing: 'per year (save $110)',
      isPopular: true,
      features: [
        'Everything in Monthly Plan',
        'Advanced AI personalization',
        'Priority email support',
        'Custom voice commands',
        'Detailed analytics & insights',
        'Early access to new features',
        '30-day money-back guarantee',
      ],
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-[#1A1A1A] mb-4">
            Choose the perfect plan
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mobile: Show popular plan first */}
          <div className="md:hidden">
            {plans
              .slice()
              .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
              .map((plan, index) => (
                <PricingCard key={plan.title} plan={plan} />
              ))}
          </div>

          {/* Desktop: Show in original order */}
          <div className="hidden md:contents">
            {plans.map((plan) => (
              <PricingCard key={plan.title} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div className="relative bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-150 ease-in-out mb-8 md:mb-0">
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#007AFF] text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
          {plan.title}
        </h3>

        <div className="mb-2">
          {plan.originalPrice && (
            <span className="text-sm text-[#6B7280] line-through mr-2">
              {plan.originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold text-[#1A1A1A]">
            {plan.price}
          </span>
        </div>

        <p className="text-[#6B7280] text-sm">{plan.billing}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
            <span className="text-[#1A1A1A] text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white font-medium py-3 px-6 rounded-md transition-colors duration-150 ease-in-out">
        Get Started
      </button>
    </div>
  );
};

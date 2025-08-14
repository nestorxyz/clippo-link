'use client';

import { Check } from 'lucide-react';

interface PricingPlan {
  title: string;
  price: string;
  originalPrice?: string;
  billing: string;
  isPopular?: boolean;
  description?: string;
  featuresTitle?: string;
  ctaText?: string;
  ctaVariant?: 'filled' | 'outlined';
  href?: string;
  features: string[];
}

export const PricingSection = () => {
  const plans: PricingPlan[] = [
    {
      title: '💡 Monthly Plan',
      price: '$4.99',
      billing: '/month',
      description:
        'Perfect for trying out DoryAI with full flexibility — no commitment, all features.',
      featuresTitle: 'What you’ll get:',
      ctaText: 'Get Started',
      ctaVariant: 'outlined',
      href: '/login?plan=monthly&intent=checkout&msg=areYouReadyToAction',
      features: [
        'Up to 200 link saving & organization',
        'Smart AI tagging & search',
        'Access from any device',
        'Cancel anytime',
      ],
    },
    {
      title: '⚡ Annual Plan',
      price: '$34.99',
      originalPrice: '$59.88',
      billing: '/year (Save 40% vs monthly)',
      isPopular: true,
      description:
        'Unlock the best value — 7-day free trial, premium features, and extra perks.',
      featuresTitle: 'What you’ll get:',
      ctaText: 'Start Free Trial',
      ctaVariant: 'filled',
      href: '/login?plan=annual&intent=checkout&msg=areYouReadyToAction',
      features: [
        'Everything in Monthly, plus:',
        'Priority feature access',
        'VIP support',
        'Exclusive productivity tips & updates',
      ],
    },
  ];

  return (
    <section id="pricing" aria-label="pricing" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-center text-5xl font-medium mb-20">
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
    <div
      className={
        'relative bg-white rounded-lg border shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-150 ease-in-out mb-8 md:mb-0 ' +
        (plan.isPopular
          ? 'border-[#007AFF] ring-1 ring-[#007AFF]'
          : 'border-[#E5E7EB]')
      }
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#007AFF] text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8 p-4 pt-7">
        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
          {plan.title}
        </h3>

        {plan.description && (
          <p className="text-[#6B7280] text-sm max-w-sm mx-auto mb-4">
            {plan.description}
          </p>
        )}

        <div className="mb-2">
          <span className="text-4xl font-semibold mr-2 text-[#1A1A1A]">
            {plan.price}
          </span>
          {plan.originalPrice && (
            <span className="text-3xl text-[#6B7280] line-through mr-2">
              {plan.originalPrice}
            </span>
          )}
        </div>

        <p className="text-[#6B7280] text-sm">{plan.billing}</p>
      </div>

      <div className="bg-[#f9f8f8] rounded-b-lg p-4 px-8">
        {plan.featuresTitle && (
          <p className="text-[#1A1A1A] text-sm font-medium mb-3 text-left">
            {plan.featuresTitle}
          </p>
        )}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
              <span className="text-[#1A1A1A] text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href={plan.href}
          className={`w-full inline-flex items-center justify-center ${
            plan.ctaVariant === 'filled'
              ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white'
              : 'border border-[#007AFF] bg-white text-[#007AFF] hover:bg-[#F0F7FF]'
          } font-medium py-3 px-6 rounded-md transition-colors duration-150 ease-in-out`}
        >
          {plan.ctaText ?? 'Get Started'}
        </a>
      </div>
    </div>
  );
};

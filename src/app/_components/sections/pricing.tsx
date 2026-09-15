'use client';

import { Check } from 'lucide-react';
import { PAID_PLAN_COPY, PaidPlanCopy } from '@/lib/billing-copy';

export const PricingSection = () => {
  const plans = PAID_PLAN_COPY;

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
              .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
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
  plan: PaidPlanCopy;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div
      className={
        'relative bg-white rounded-lg border shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-all duration-150 ease-in-out mb-8 md:mb-0 ' +
        (plan.popular
          ? 'border-[#007AFF] ring-1 ring-[#007AFF]'
          : 'border-[#E5E7EB]')
      }
    >
      {plan.popular && (
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

        <p className="text-[#6B7280] text-sm max-w-sm mx-auto mb-4">
          {plan.description}
        </p>

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
        <p className="text-[#1A1A1A] text-sm font-medium mb-3 text-left">
          {plan.featuresTitle}
        </p>
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
              <span className="text-[#1A1A1A] text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href={`/auth/after?plan=${plan.key}&intent=checkout`}
          className={`w-full inline-flex items-center justify-center ${
            plan.popular
              ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white'
              : 'border border-[#007AFF] bg-white text-[#007AFF] hover:bg-[#F0F7FF]'
          } font-medium py-3 px-6 rounded-md transition-colors duration-150 ease-in-out`}
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );
};

'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PricingModal({ open, onClose }: Props) {
  const { data: plan } = usePlan();
  const current = plan?.plan === 'premium' ? 'annual-or-monthly' : 'free';

  const plans = useMemo(
    () => [
      {
        key: 'monthly' as const,
        title: '💡 Monthly Plan',
        price: '$4.99',
        billing: '/month',
        description:
          'Perfect for trying out DoryAI with full flexibility — no commitment, all features.',
        featuresTitle: 'What you’ll get:',
        features: [
          'Up to 200 link saving & organization',
          'Smart AI tagging & search',
          'Access from any device',
          'Cancel anytime',
        ],
        cta: 'Get Started',
      },
      {
        key: 'annual' as const,
        title: '⚡ Annual Plan',
        price: '$34.99',
        originalPrice: '$59.88',
        billing: '/year (Save 40% vs monthly)',
        description:
          'Unlock the best value — 7-day free trial, premium features, and extra perks.',
        featuresTitle: 'What you’ll get:',
        features: [
          'Everything in Monthly, plus:',
          'Priority feature access',
          'VIP support',
          'Exclusive productivity tips & updates',
        ],
        cta: 'Start Free Trial',
        popular: true,
      },
    ],
    []
  );

  const handleSelect = (key: 'monthly' | 'annual') => {
    const url = `/auth/after?plan=${key}&intent=checkout&msg=areYouReadyToAction`;
    window.location.href = url;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-5xl rounded-2xl bg-[#0F0F0F] text-white shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
                Choose the perfect plan
              </h2>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {plans.map((p) => {
                  const isCurrent =
                    current !== 'free' && plan?.plan === 'premium';
                  return (
                    <div
                      key={p.key}
                      className={`relative rounded-xl border ${
                        p.popular ? 'border-[#3B82F6]' : 'border-[#1D1D1D]'
                      } shadow-sm hover:shadow-md transition-shadow`}
                    >
                      {p.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          {p.title}
                        </h3>
                        <div className="mb-1">
                          <span className="text-3xl font-bold">{p.price}</span>{' '}
                          {p.originalPrice && (
                            <span className="text-lg text-gray-500 line-through ml-2">
                              {p.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">{p.billing}</p>
                      </div>
                      <div className="bg-[#1D1D1D] text-[#A5A5A5] p-6 rounded-b-xl">
                        <p className="text-sm font-medium mb-3">
                          {p.featuresTitle}
                        </p>
                        <ul className="space-y-3 mb-6">
                          {p.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm"
                            >
                              <Check className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          disabled={isCurrent}
                          onClick={() => handleSelect(p.key)}
                          className={`w-full rounded-md py-3 font-medium transition-colors ${
                            p.popular
                              ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                              : 'border border-[#3B82F6] text-white'
                          } ${
                            isCurrent ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          {isCurrent ? 'Your current plan' : p.cta}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

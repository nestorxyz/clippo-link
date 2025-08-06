import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Users, Shield } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  annualPrice?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaVariant: 'default' | 'outline';
  isPopular?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for getting started with AI video creation',
    features: [
      '5 videos per month',
      'Basic templates',
      '720p export quality',
      'DoryAI watermark',
      'Community support',
      'AI video generation',
    ],
    ctaText: 'Start Free',
    ctaVariant: 'outline',
  },
  {
    name: 'Creator',
    price: '$29',
    annualPrice: '$19',
    description: 'Everything you need to create professional videos',
    features: [
      'Unlimited videos',
      'Premium templates & effects',
      '4K export quality',
      'No watermark',
      'Priority support',
      'Brand kit customization',
      'Social media scheduling',
      'AI video generation',
    ],
    ctaText: 'Start Creating',
    ctaVariant: 'default',
    isPopular: true,
  },
  {
    name: 'Business',
    price: '$99',
    annualPrice: '$79',
    description: 'Advanced features for teams and enterprises',
    features: [
      'Everything in Creator',
      'Team collaboration',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      'AI video generation',
    ],
    ctaText: 'Contact Sales',
    ctaVariant: 'outline',
  },
];

const faqs: FAQ[] = [
  {
    question: 'Can I change plans at any time?',
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    question: "What's included in the money-back guarantee?",
    answer:
      "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full, no questions asked.",
  },
  {
    question: 'Do you offer annual billing discounts?',
    answer:
      'Yes! Save up to 35% when you choose annual billing. The Creator plan is $19/month (billed annually) and Business is $79/month (billed annually).',
  },
  {
    question: 'What video formats can I export?',
    answer:
      'All plans support MP4 exports. Starter includes 720p quality, while Creator and Business plans include up to 4K resolution exports.',
  },
  {
    question: 'Is there a limit on video length?',
    answer:
      'Starter plans have a 2-minute limit per video. Creator and Business plans support videos up to 30 minutes long.',
  },
  {
    question: 'Can I use my own branding?',
    answer:
      'Creator and Business plans include brand kit customization and no watermark. Business plans also offer white-label options for complete brand control.',
  },
  {
    question: 'What kind of support do you provide?',
    answer:
      'Starter includes community support, Creator gets priority email support, and Business plans include a dedicated account manager plus phone support.',
  },
  {
    question: 'Do you offer team collaboration features?',
    answer:
      'Team collaboration is available on Business plans, including shared workspaces, user management, and project sharing capabilities.',
  },
];

export const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-accent/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 font-body font-medium">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading text-text-heading mb-6">
            Create Without Limits
          </h2>
          <p className="text-xl text-text-body font-body max-w-2xl mx-auto">
            Choose the perfect plan for your video creation needs. All plans
            include our powerful AI video generation technology.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-body text-text-body">
              30-day money-back guarantee
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                tier.isPopular
                  ? 'border-primary border-2 shadow-lg scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground font-body font-semibold px-6 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-heading text-text-heading mb-2">
                  {tier.name}
                </CardTitle>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold font-heading text-text-heading">
                      {tier.price}
                    </span>
                    <span className="text-text-body font-body">/month</span>
                  </div>
                  {tier.annualPrice && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="font-body text-xs">
                        Save 35% • {tier.annualPrice}/month billed annually
                      </Badge>
                    </div>
                  )}
                </div>
                <CardDescription className="text-text-body font-body">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-body font-body">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.ctaVariant}
                  size="lg"
                  className={`w-full font-body font-semibold ${
                    tier.isPopular
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : ''
                  }`}
                >
                  {tier.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-6 text-sm text-text-body font-body">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>All plans include AI video generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading text-text-heading mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-text-body font-body">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-heading text-text-heading">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-body font-body leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-body font-body mb-6">
            Still have questions? Our team is here to help.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="font-body font-semibold"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Star, CheckCircle } from 'lucide-react';

interface CTAStats {
  label: string;
  value: string;
}

interface CTAProps {
  className?: string;
}

export const CTA = ({ className = '' }: CTAProps) => {
  const stats: CTAStats[] = [
    { label: 'Active Creators', value: '50,000+' },
    { label: 'Videos Created', value: '2M+' },
    { label: 'Success Rate', value: '98%' },
  ];

  return (
    <section className={`relative overflow-hidden py-24 ${className}`}>
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF9F3] via-[#ece0d1] to-[#86462C]/10" />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#86462C]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-16 w-64 h-64 bg-gradient-to-r from-[#86462C]/10 to-transparent rounded-full blur-2xl" />
        <div
          className="absolute bottom-0 right-1/4 w-32 h-32 bg-[#86462C]/8 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: '3s' }}
        />
      </div>

      <div className="relative container mx-auto px-6 text-center">
        {/* Main Headline */}
        <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-[#583120] mb-6 leading-tight">
          Your Video Empire
          <span className="block text-[#86462C]">Starts Today</span>
        </h2>

        {/* Emotional Subheadline */}
        <p className="text-xl md:text-2xl text-[#665c56] mb-4 max-w-4xl mx-auto leading-relaxed">
          <span className="font-semibold">While others dream,</span> successful
          creators are already building their audience.
        </p>

        <p className="text-lg md:text-xl text-[#86462C] mb-12 max-w-3xl mx-auto font-medium">
          Don't let another day pass watching from the sidelines. Your
          breakthrough moment is one click away.
        </p>

        {/* Social Proof Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-[#86462C]/10"
            >
              <Star className="w-5 h-5 text-[#86462C] fill-current" />
              <span className="font-semibold text-[#583120]">{stat.value}</span>
              <span className="text-[#665c56]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA Button */}
        <div className="mb-8">
          <Button
            size="lg"
            className="
              group relative overflow-hidden
              bg-[#86462C] hover:bg-[#A0553A] 
              text-[#FDF9F3] 
              px-12 py-6 
              text-xl font-bold 
              rounded-2xl 
              shadow-2xl 
              transition-all duration-300 
              hover:scale-105 
              hover:shadow-[0_20px_40px_rgba(134,70,44,0.3)]
              border-2 border-[#86462C]
              min-w-[320px]
            "
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              Start Creating Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
        </div>

        {/* Risk Reversal & Supporting Text */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-[#665c56]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#86462C]" />
              <span className="font-medium">Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#86462C]" />
              <span className="font-medium">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#86462C]" />
              <span className="font-medium">Setup in 60 Seconds</span>
            </div>
          </div>

          <p className="text-[#665c56] italic">
            Join thousands of creators who wished they started sooner.
            <span className="font-semibold text-[#86462C]">
              {' '}
              Your future self will thank you.
            </span>
          </p>
        </div>

        {/* Community Indicator */}
        <div className="mt-12 flex items-center justify-center gap-3 text-[#665c56]">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 bg-gradient-to-br from-[#86462C] to-[#A0553A] rounded-full border-2 border-white flex items-center justify-center"
              >
                <Users className="w-5 h-5 text-white" />
              </div>
            ))}
          </div>
          <span className="font-medium">
            <span className="text-[#86462C] font-bold">2,847</span> creators
            joined this week
          </span>
        </div>
      </div>
    </section>
  );
};

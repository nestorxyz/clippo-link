'use client';

import { useRef } from 'react';
import {
  Brain,
  Lightbulb,
  Compass,
  Users,
  Sparkles,
  Heart,
} from 'lucide-react';

const WordReveal = ({
  children,
  delay = 0,
}: {
  children: string;
  delay?: number;
}) => {
  const words = children.split(' ');

  return (
    <span className="inline-block">
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block mr-2 animate-in fade-in slide-in-from-bottom-2 duration-700"
          style={{
            animationDelay: `${delay + index * 0.1}s`,
            animationFillMode: 'both',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

const FloatingIcon = ({
  icon: Icon,
  className = '',
  delay = 0,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={`absolute animate-float ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
    >
      <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  );
};

export const ForPeopleLikeYou = () => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20"
    >
      {/* Background blur effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-100/40 to-purple-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-purple-100/40 to-pink-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50/30 to-purple-50/20 rounded-full blur-3xl" />
      </div>

      {/* Floating decorative elements */}
      <FloatingIcon icon={Brain} className="top-16 left-[10%]" delay={0.5} />
      <FloatingIcon icon={Lightbulb} className="top-32 right-[15%]" delay={1} />
      <FloatingIcon
        icon={Compass}
        className="bottom-24 left-[20%]"
        delay={1.5}
      />
      <FloatingIcon icon={Users} className="bottom-40 right-[25%]" delay={2} />
      <FloatingIcon icon={Heart} className="top-1/2 right-[8%]" delay={2.5} />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center">
        {/* Main headline */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-8 text-slate-900">
            <span className="block">
              <WordReveal delay={0.2}>Built for</WordReveal>
            </span>
            <span className="block gradient-text">
              <WordReveal delay={0.8}>thinkers,</WordReveal>
            </span>
            <span className="block gradient-text">
              <WordReveal delay={1.4}>makers,</WordReveal>
            </span>
            <span className="block">
              <WordReveal delay={2.0}>and the</WordReveal>
            </span>
            <span className="block gradient-text">
              <WordReveal delay={2.6}>curious.</WordReveal>
            </span>
          </h2>
        </div>

        {/* Supporting text */}
        <div
          className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000"
          style={{ animationDelay: '3.2s', animationFillMode: 'both' }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-body text-slate-600 leading-relaxed mb-8">
            <WordReveal delay={3.5}>
              Whether you're building a startup, learning AI, or planning a trip
              — DoryAI helps you capture the web like never before.
            </WordReveal>
          </p>
        </div>

        {/* Identity cards */}
        <div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-6 duration-1000"
          style={{ animationDelay: '5s', animationFillMode: 'both' }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              The Builder
            </h3>
            <p className="text-slate-600 leading-relaxed">
              You're creating something new. DoryAI organizes your research,
              inspiration, and resources so you can focus on building.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              The Learner
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every day brings new discoveries. DoryAI turns your curiosity into
              a searchable knowledge base that grows with you.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              The Explorer
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Life's an adventure, and the web is full of gems. DoryAI helps you
              collect and treasure everything you discover.
            </p>
          </div>
        </div>

        {/* Subtle call-to-action hint */}
        <div
          className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000"
          style={{ animationDelay: '6s', animationFillMode: 'both' }}
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span className="text-slate-700 font-medium text-lg">
              <WordReveal delay={6.2}>
                Join thousands of curious minds already using DoryAI
              </WordReveal>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

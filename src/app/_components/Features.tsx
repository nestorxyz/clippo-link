'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  MessageCircle,
  Tags,
  FolderOpen,
  Search,
  Brain,
  Hash,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  tooltip: string;
}

const features: Feature[] = [
  {
    icon: MessageCircle,
    title: '🧠 Chat-first interface',
    description: 'Save and retrieve links using natural chat commands.',
    tooltip: 'Ask me about Joshi gifts 💝',
  },
  {
    icon: Tags,
    title: '🏷️ Smart tagging',
    description: 'AI auto-generates searchable tags from content.',
    tooltip: "I'll tag that recipe as 'dinner', 'italian', 'quick' ✨",
  },
  {
    icon: FolderOpen,
    title: '📁 Personalized structure',
    description:
      'Create custom categories like "Startup Ideas" or "Joshi – Gift Ideas."',
    tooltip: 'Your folders, your way! 📂',
  },
  {
    icon: Search,
    title: '🔍 Instant search',
    description: 'Ask "Show me marketing stuff for LukAI" — DoryAI finds it.',
    tooltip: "I remember everything so you don't have to! 🎯",
  },
  {
    icon: Brain,
    title: '🧩 Context-aware memory',
    description: 'DoryAI remembers the "why" behind each saved link.',
    tooltip: 'I know you saved that for your weekend project! 🔗',
  },
  {
    icon: Hash,
    title: '💬 Natural input',
    description: 'Use plain language, even emojis 🧃✨',
    tooltip: "Talk to me like you'd talk to a friend! 😊",
  },
];

export const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
            Meet your new
            <span className="block gradient-text">link companion</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body leading-relaxed">
            Powerful features that make saving and finding links feel like
            magic. No more digging through bookmarks or forgotten tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border border-slate-200 hover:border-indigo-300 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-8 relative">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-300 rounded-2xl" />

                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <IconComponent className="w-7 h-7 text-indigo-600" />
                      </div>
                    </div>

                    <h3 className="text-xl font-heading font-semibold text-slate-900 mb-4 group-hover:text-indigo-800 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 font-body leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* DoryAI Tooltip */}
                    <div
                      className={`absolute -top-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 ${
                        hoveredFeature === index
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-95 translate-y-2'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{feature.tooltip}</span>
                      </div>
                      {/* Speech bubble tail */}
                      <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-500 transform translate-y-full" />
                    </div>

                    {/* Animated stagger effect */}
                    <div
                      className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-6 py-3 mb-6">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-700">
                All features included in free plan
              </span>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ready to experience the future of link organization?
            <br />
            <strong className="text-slate-900 font-semibold">
              Join thousands who've already made the switch.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
};

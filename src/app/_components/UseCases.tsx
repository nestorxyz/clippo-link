'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Brain,
  BookOpen,
  Link,
  Heart,
  Wrench,
  Sparkles,
  ArrowDown,
  Inbox,
} from 'lucide-react';
import { useState } from 'react';

const useCases = [
  {
    icon: Brain,
    title: 'Build a second brain for your ideas',
    description:
      'Capture thoughts, insights, and inspiration as they come. Create connections between ideas and watch your knowledge grow.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    animation: 'brain',
  },
  {
    icon: BookOpen,
    title: 'Store research for school, work, or content',
    description:
      'Organize articles, papers, and resources by project or topic. Never lose track of important research again.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    animation: 'book',
  },
  {
    icon: Link,
    title: 'Save links from X, Reddit, or friends — and never lose them',
    description:
      'That perfect article someone shared? That viral thread you want to revisit? Keep them all in one organized place.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    animation: 'link',
  },
  {
    icon: Heart,
    title: 'Organize personal inspiration: travel, gifts, hobbies',
    description:
      'Collect travel destinations, gift ideas, recipes, and hobby resources. Make your personal interests easily accessible.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    hoverColor: 'hover:bg-rose-100',
    animation: 'heart',
  },
  {
    icon: Wrench,
    title: 'Collect tutorials, components, tools, tweets',
    description:
      'Build your toolkit of helpful tutorials, code snippets, design components, and insightful tweets for future reference.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    animation: 'tools',
  },
];

const LinkDropAnimation = () => (
  <div className="absolute top-2 right-2 opacity-30">
    <ArrowDown className="w-4 h-4 text-current animate-bounce" />
    <Inbox className="w-4 h-4 text-current mt-1" />
  </div>
);

const FloatingDots = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`absolute w-2 h-2 ${color
          .replace('text-', 'bg-')
          .replace('-600', '-300')} rounded-full opacity-20 animate-pulse`}
        style={{
          left: `${20 + i * 30}%`,
          top: `${30 + i * 20}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: '3s',
        }}
      />
    ))}
  </div>
);

export const UseCases = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-white to-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
            Perfect for every
            <span className="block gradient-text">digital collector</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body leading-relaxed">
            See how Clippo adapts to your unique way of collecting and
            organizing information. Whatever you're building, we've got you
            covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <Card
                key={index}
                className={`group relative h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-slate-200 bg-white ${useCase.hoverColor}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-8 relative">
                  {/* Background Animation Elements */}
                  <FloatingDots color={useCase.color} />
                  {index === 2 && <LinkDropAnimation />}

                  {/* Icon with animated background */}
                  <div
                    className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl ${useCase.bgColor} mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${useCase.color} transition-transform duration-300 group-hover:scale-110`}
                    />

                    {/* Pulse effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl ${useCase.bgColor} opacity-60 animate-pulse`}
                      style={{ animationDuration: '2s' }}
                    />

                    {/* Sparkle effect on hover */}
                    {hoveredCard === index && (
                      <div
                        className="absolute -top-1 -right-1 animate-spin"
                        style={{ animationDuration: '3s' }}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-3 leading-tight group-hover:text-slate-800 transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {useCase.description}
                  </p>

                  {/* Hover indicator */}
                  <div
                    className={`absolute bottom-4 right-4 transition-all duration-300 ${
                      hoveredCard === index
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-2'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                  </div>

                  {/* Microanimation for link use case */}
                  {index === 2 && hoveredCard === index && (
                    <div className="absolute top-4 left-4 flex flex-col gap-1">
                      <div className="w-12 h-1 bg-green-200 rounded animate-pulse" />
                      <div
                        className="w-8 h-1 bg-green-300 rounded animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-10 h-1 bg-green-400 rounded animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Works with any type of content
            </span>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ready to transform how you save and organize your digital
            discoveries? <br />
            <strong className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors duration-300 cursor-pointer">
              Start your organized digital life today
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

type FeatureItem = {
  title: string;
  description: string;
  imageUrl: string;
};

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: 'Organize personal inspiration: travel, gifts, hobbies',
    description:
      'Collect travel destinations, gift ideas, recipes, and hobby resources. Make your personal interests easily accessible.',
    imageUrl: '/landing/personal-inspo.png',
  },
  {
    title: 'Collect tutorials, components, tools, tweets',
    description:
      'Build your toolkit of helpful tutorials, code snippets, design components, and insightful tweets for future reference.',
    imageUrl: '/landing/tutorials.png',
  },
  {
    title: 'Store research for school, work, or content',
    description:
      'Organize articles, papers, and resources by project or topic. Never lose track of important research again.',
    imageUrl: '/landing/research.png',
  },
];

export const FeaturesDemo: React.FC<{ items?: FeatureItem[] }> = ({
  items = DEFAULT_FEATURES,
}) => {
  return (
    <section
      id="features"
      aria-label="Features"
      className="py-20 w-full flex flex-col items-center justify-center mx-auto scroll-mt-28"
    >
      <div className="mx-auto w-full max-w-[1242px]">
        <h2 className="text-center text-5xl font-medium mb-20">
          See the magic in action!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-[110px]">
          {items.map((item, idx) => (
            <div key={idx} className="md:col-span-2 lg:col-span-3">
              <div
                className={`flex flex-col ${
                  idx === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                } items-center gap-8 justify-between`}
              >
                {/* Left: Image preview */}
                <div className="w-full md:w-[49%]">
                  <div className="bg-light-background rounded-lg">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                {/* Right: Text content */}
                <div className="w-full md:w-[42%] space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-medium leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-[#646363] font-light lg:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

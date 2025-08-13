'use client';

import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, Globe } from 'lucide-react';

interface Testimonial {
  name: string;
  title: string;
  review: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    title: 'Marketing Director',
    review:
      'April has transformed how I manage emails during my commute. The AI summaries are incredibly accurate and save me hours every week.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b332c433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    name: 'Michael Rodriguez',
    title: 'Startup Founder',
    review:
      "As a founder, I'm constantly on the move. April's voice integration lets me stay on top of critical emails without stopping what I'm doing.",
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    name: 'Jennifer Kim',
    title: 'Executive Assistant',
    review:
      'The email prioritization is spot-on. April understands which messages need immediate attention and which can wait.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    name: 'David Thompson',
    title: 'Sales Manager',
    review:
      "I love how it learns my communication style. The suggested responses feel like they're written by me.",
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    name: 'Lisa Wang',
    title: 'Consultant',
    review:
      'Finally, an email app that works perfectly with CarPlay. I can manage my inbox safely while driving.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1388&q=80',
  },
  {
    name: 'Robert Anderson',
    title: 'Product Manager',
    review:
      'The security features give me peace of mind. Apple-level encryption is exactly what I need for confidential emails.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 min-w-[300px] md:min-w-[400px] flex-shrink-0">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 font-inter">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-600 font-inter">
            {testimonial.title}
          </p>
        </div>
      </div>

      <div className="flex items-center mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-700 leading-relaxed font-inter">
        "{testimonial.review}"
      </p>
    </div>
  );
};

export const CustomerReviews: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = () => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    };

    autoplayRef.current = setInterval(autoplay, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [emblaApi]);

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-600 font-inter">
            <Globe className="w-4 h-4 mr-2" />
            Trusted by users globally
          </div>
        </div>

        <h2 className="text-4xl font-semibold text-gray-900 font-inter mb-4">
          Customers love our app
        </h2>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1"
              />
            ))}
            <span className="ml-2 text-lg font-medium text-gray-900 font-inter">
              4.9/5.0 stars
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

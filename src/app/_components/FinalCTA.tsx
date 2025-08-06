'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Link2,
  Bookmark,
  Copy,
  Eye,
  Star,
  Zap,
  Brain,
  CheckCircle,
  Shield,
} from 'lucide-react';

export const FinalCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const floatingLinks = [
    { icon: Link2, delay: 0 },
    { icon: Bookmark, delay: 2 },
    { icon: Copy, delay: 4 },
    { icon: Eye, delay: 1 },
    { icon: Star, delay: 3 },
    { icon: Zap, delay: 5 },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* DoryAI Avatar with Orbiting Links */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Central Avatar */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          {/* Avatar Glow */}
          <div className="absolute inset-0 w-40 h-40 bg-white/20 rounded-full blur-xl animate-pulse" />

          {/* Avatar */}
          <div className="relative w-32 h-32 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl border-4 border-white/50 flex items-center justify-center">
            <Brain className="w-12 h-12 text-indigo-600" />
          </div>

          {/* Orbiting Links - Simple floating animation */}
          {floatingLinks.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="absolute w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white/70 animate-float"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${
                    80 + index * 15
                  }px, ${Math.sin((index * Math.PI) / 3) * 40}px)`,
                  animationDelay: `${item.delay}s`,
                  animationDuration: '4s',
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Headline */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 leading-tight">
            Ready to give your brain a{' '}
            <span className="text-yellow-300 animate-pulse">backup?</span>
          </h1>
        </div>

        {/* Supporting Text */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop losing brilliant ideas to the digital abyss. Let DoryAI be your
            AI-powered memory assistant that never forgets.
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Button
            size="lg"
            className="group text-xl px-12 py-6 rounded-2xl bg-white text-indigo-600 hover:bg-yellow-300 hover:text-indigo-700 shadow-2xl hover:shadow-white/25 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm font-bold animate-breathe"
            onClick={() => window.open('https://app.clippo.ai', '_blank')}
          >
            <span className="mr-3">Try DoryAI Now</span>
            <ArrowRight
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div
          className={`transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm font-medium">Free to start</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Star size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Privacy-first design</span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div
          className={`transition-all duration-1000 delay-1400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mt-8 flex items-center justify-center gap-3 text-white/80">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center"
                >
                  <span className="text-xs">😊</span>
                </div>
              ))}
            </div>
            <span className="text-sm font-medium">
              Join <strong className="text-yellow-300">2,847</strong> curious
              minds this week
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

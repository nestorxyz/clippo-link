'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageCircle, Send } from 'lucide-react';

export const Hero = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const demoMessages = [
    {
      user: 'Toji gym shirt',
      link: 'https://geekwear.com/toji-shirt',
      clippoResponse: 'Saved to 🏋️ Geekwear / G9 — tags: gym, anime, toji',
    },
    {
      user: 'startup idea for AI marketing',
      link: 'https://techcrunch.com/ai-marketing-trends',
      clippoResponse:
        'Saved to 💡 Startup Ideas / Marketing — tags: AI, marketing, startup',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % demoMessages.length);
        setIsTyping(false);
      }, 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-100/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight tracking-tight text-slate-900">
                Never lose a
                <span className="block gradient-text">link again.</span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Save links by chatting. Your AI assistant organizes them
                instantly — with context, tags, and memory.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="group text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold animate-breathe"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Try DoryAI
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  document
                    .querySelector('#in-action')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See Examples
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Setup in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Right Column - Demo Chat UI */}
          <div className="lg:order-last">
            <div className="relative max-w-md mx-auto">
              {/* Chat Interface Mock */}
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">DoryAI</div>
                    <div className="text-white/80 text-sm">
                      Your link assistant
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 h-80 overflow-hidden">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-lg max-w-xs">
                      <div className="text-sm font-medium mb-1">
                        {demoMessages[currentMessage].user}
                      </div>
                      <div className="text-xs opacity-80 font-mono">
                        {demoMessages[currentMessage].link}
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DoryAI Response */}
                  {!isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-lg max-w-xs">
                        <div className="text-sm text-slate-800">
                          {demoMessages[currentMessage].clippoResponse}
                        </div>
                        <div className="flex gap-1 mt-2">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                            gym
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            anime
                          </span>
                          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                            toji
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t border-slate-200 p-4">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <MessageCircle className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Drop a link or describe what you found..."
                      className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                      disabled
                    />
                    <Send className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white font-bold text-sm">AI</span>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-200 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-sm font-medium text-slate-800">
                  ✨ Instant Organization
                </div>
                <div className="text-xs text-slate-500">
                  Context + Tags + Memory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="text-center pt-16">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
            </div>
            <span>Scroll to see how it works</span>
          </div>
        </div>
      </div>
    </section>
  );
};

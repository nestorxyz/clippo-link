'use client';

import React, { useState } from 'react';
import { MessageCircle, Bot, Sparkles, Brain, Zap } from 'lucide-react';

export const WhatIsClippo = () => {
  const [hoveredSentence, setHoveredSentence] = useState<string | null>(null);
  const [clippoState, setClippoState] = useState<'normal' | 'tilted' | 'blink'>(
    'normal'
  );

  const sentences = [
    {
      id: 'intro',
      text: 'Clippo is your personal link assistant, powered by AI.',
      tooltip: 'Think of me as your digital memory that never forgets! 🧠',
    },
    {
      id: 'process',
      text: "Just drop a link in the chat. Tell Clippo what it's about. Done — it's remembered, tagged, and ready to find later.",
      tooltip:
        "Example: 'Cool recipe for Sunday dinner' → instantly organized and findable! ✨",
    },
    {
      id: 'solution',
      text: 'Forget folders, tabs, and bookmarks.',
      tooltip: 'No more endless browser tabs or forgotten bookmark folders 📂',
    },
    {
      id: 'conclusion',
      text: 'Now, you just talk.',
      tooltip: 'Natural conversation instead of manual organization 💬',
    },
  ];

  const handleSentenceHover = (sentenceId: string | null) => {
    setHoveredSentence(sentenceId);
    if (sentenceId) {
      setClippoState(Math.random() > 0.5 ? 'tilted' : 'blink');
    } else {
      setClippoState('normal');
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-tight">
              What is Clippo?
            </h2>

            <div className="space-y-6 text-lg lg:text-xl text-slate-600 leading-relaxed">
              {sentences.map((sentence, index) => (
                <div key={sentence.id} className="relative">
                  <span
                    className="cursor-pointer transition-all duration-300 hover:text-slate-900 relative group"
                    onMouseEnter={() => handleSentenceHover(sentence.id)}
                    onMouseLeave={() => handleSentenceHover(null)}
                  >
                    {sentence.text}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left transition-transform duration-300 ${
                        hoveredSentence === sentence.id
                          ? 'scale-x-100'
                          : 'scale-x-0'
                      }`}
                      style={{ width: '100%' }}
                    />
                  </span>

                  {/* Tooltip */}
                  <div
                    className={`absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-slate-200 text-sm text-slate-600 max-w-xs z-10 transition-all duration-200 ${
                      hoveredSentence === sentence.id
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                    }`}
                  >
                    {sentence.tooltip}
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-slate-200 transform rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Clippo Character */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Floating background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-xl scale-150 animate-pulse" />

              {/* Clippo Character Container */}
              <div
                className={`relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 transition-all duration-300 ${
                  clippoState === 'tilted' ? 'rotate-3' : ''
                } animate-float`}
                style={{
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                }}
              >
                {/* Clippo Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div
                    className={`w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-300 ${
                      clippoState === 'blink' ? 'scale-95' : 'scale-100'
                    }`}
                  >
                    <Brain className="w-16 h-16 text-white" />

                    {/* Eyes animation for blink */}
                    <div
                      className={`absolute top-6 left-8 w-2 h-2 bg-white rounded-full transition-transform duration-200 ${
                        clippoState === 'blink' ? 'scale-y-10' : 'scale-y-100'
                      }`}
                    />
                    <div
                      className={`absolute top-6 right-8 w-2 h-2 bg-white rounded-full transition-transform duration-200 ${
                        clippoState === 'blink' ? 'scale-y-10' : 'scale-y-100'
                      }`}
                    />

                    {/* Sparkles around avatar */}
                    <div
                      className="absolute -top-2 -right-2 animate-spin"
                      style={{ animationDuration: '8s' }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div
                      className="absolute -bottom-1 -left-1 animate-spin"
                      style={{
                        animationDirection: 'reverse',
                        animationDuration: '6s',
                      }}
                    >
                      <Zap className="w-4 h-4 text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Speech bubble */}
                <div
                  className={`bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-4 relative transition-transform duration-300 ${
                    hoveredSentence ? 'scale-102' : 'scale-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-indigo-500" />
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        hoveredSentence ? 'text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      {hoveredSentence
                        ? 'I love helping organize your digital life! 🎉'
                        : 'Hey there! Ready to save some links? ✨'}
                    </p>
                  </div>

                  {/* Speech bubble tail */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-slate-50 to-indigo-50 rotate-45 border-l border-t border-slate-200" />
                </div>

                {/* Floating action indicators */}
                <div
                  className="absolute -right-4 top-1/4 bg-white rounded-full p-2 shadow-lg border border-slate-200 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div
                  className="absolute -left-4 bottom-1/4 bg-white rounded-full p-2 shadow-lg border border-slate-200 animate-bounce"
                  style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

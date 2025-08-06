'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  User,
  Sparkles,
  ExternalLink,
  Send,
  MessageCircle,
} from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'clippo';
  content: string;
  tags?: string[];
  folder?: string;
  isVisible: boolean;
  isTyping?: boolean;
  hasPreview?: boolean;
  previewText?: string;
}

const chatScenarios = [
  {
    user: 'Cool design inspiration site https://dribbble.com/shots/awesome-ui',
    clippo: 'Saved to 🎨 Design Inspo — tags: ui, inspiration, portfolio',
    tags: ['ui', 'inspiration', 'portfolio'],
    folder: '🎨 Design Inspo',
    hasPreview: true,
    previewText: 'Beautiful portfolio showcasing modern web design trends',
  },
  {
    user: 'Gift ideas for Joshi https://giftguide.com/unique-presents',
    clippo: 'Added to 🎁 Joshi — Gift Ideas — tags: gifts, personal, shopping',
    tags: ['gifts', 'personal', 'shopping'],
    folder: '🎁 Joshi — Gift Ideas',
    hasPreview: true,
    previewText:
      'Curated list of unique gift ideas for different personalities',
  },
  {
    user: 'LukAI marketing strategy https://techcrunch.com/ai-marketing',
    clippo: 'Organized in 🚀 LukAI / Marketing — tags: ai, marketing, strategy',
    tags: ['ai', 'marketing', 'strategy'],
    folder: '🚀 LukAI / Marketing',
    hasPreview: true,
    previewText: 'Latest trends in AI startup marketing and growth strategies',
  },
];

export const ClippoInAction = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const resetAndStartDemo = () => {
    setMessages([]);
    setCurrentScenario(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const scenario = chatScenarios[currentScenario];
    let messageId = 1;

    const runScenario = async () => {
      // User message with typing effect
      const userMessage: Message = {
        id: messageId++,
        type: 'user',
        content: scenario.user,
        isVisible: false,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, isVisible: true } : msg
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // DoryAI typing indicator
      const typingMessage: Message = {
        id: messageId++,
        type: 'clippo',
        content: '',
        isVisible: true,
        isTyping: true,
      };

      setMessages((prev) => [...prev, typingMessage]);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // DoryAI response
      const clippoMessage: Message = {
        id: messageId++,
        type: 'clippo',
        content: scenario.clippo,
        tags: scenario.tags,
        folder: scenario.folder,
        isVisible: true,
        hasPreview: scenario.hasPreview,
        previewText: scenario.previewText,
      };

      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        clippoMessage,
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Move to next scenario or restart
      if (currentScenario < chatScenarios.length - 1) {
        setCurrentScenario((prev) => prev + 1);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setCurrentScenario(0);
        setMessages([]);
      }
    };

    runScenario();
  }, [currentScenario, isPlaying]);

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-sm text-slate-500">DoryAI is organizing...</span>
    </div>
  );

  const PreviewCard = ({ text }: { text: string }) => (
    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-all duration-200 group">
      <div className="flex items-center space-x-2">
        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span>Click to preview: "{text}"</span>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              Live Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
            Watch DoryAI
            <span className="block gradient-text">organize in real-time</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            See how DoryAI intelligently understands, tags, and organizes your
            links through natural conversation.
            <br className="hidden md:block" />
            It's like having a personal assistant for your digital life.
          </p>
          <Button
            onClick={resetAndStartDemo}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isPlaying ? 'Restart Demo' : 'Start Interactive Demo'}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-2xl border-0 overflow-hidden rounded-3xl">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">DoryAI</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm opacity-90">
                      Your AI link assistant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.length === 0 && !isPlaying && (
                <div className="text-center text-slate-500 py-16">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium mb-2">
                    Ready to see the magic?
                  </p>
                  <p className="text-sm">
                    Click "Start Interactive Demo" to watch DoryAI organize
                    links in real-time!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user'
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  } ${
                    message.isVisible
                      ? 'animate-in slide-in-from-bottom-2 duration-500'
                      : 'opacity-0'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                      message.type === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-indigo-600 border-2 border-indigo-100'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.type === 'user' ? 'text-right' : ''
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                        <TypingIndicator />
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-sm ${
                          message.type === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-sm leading-relaxed ${
                            message.type === 'user'
                              ? 'text-white'
                              : 'text-slate-800'
                          }`}
                        >
                          {message.content}
                        </p>

                        {message.tags && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {message.tags.map((tag, index) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200 rounded-full px-3 py-1 animate-in zoom-in-50 duration-300 hover:scale-105 transition-transform"
                                style={{ animationDelay: `${index * 150}ms` }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {message.hasPreview && message.previewText && (
                          <div
                            className="animate-in fade-in-50 duration-500"
                            style={{ animationDelay: '800ms' }}
                          >
                            <PreviewCard text={message.previewText} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Preview */}
            <div className="p-6 border-t border-slate-200 bg-white">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <MessageCircle className="w-5 h-5 text-slate-400" />
                <span className="text-slate-500 text-sm flex-1">
                  Drop a link or describe what you found...
                </span>
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Demo Controls */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {chatScenarios.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentScenario && isPlaying
                      ? 'bg-indigo-600 scale-125'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              Demo automatically cycles through different scenarios
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-white shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              Intelligent Tagging
            </h3>
            <p className="text-slate-600 leading-relaxed">
              DoryAI automatically generates relevant tags from context, making
              your links instantly searchable.
            </p>
          </Card>

          <Card className="p-8 text-center bg-white shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              Natural Conversation
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Just drop links or chat naturally—no complex commands or
              complicated folder structures.
            </p>
          </Card>

          <Card className="p-8 text-center bg-white shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-3 text-lg">
              Smart Organization
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Links automatically sorted into logical folders and collections
              based on your personal patterns.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

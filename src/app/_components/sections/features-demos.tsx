'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  MailIcon,
  MapPinIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
} from 'lucide-react';

export const FeaturesDemo = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-semibold text-dark-text mb-16">
          See the magic in action!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {/* Email Thread Summarization */}
          <Card className="p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border rounded-lg">
            <div className="mb-6">
              <div className="bg-light-background rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <MailIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="ml-11 mt-4 p-3 bg-primary/10 rounded-md border-l-4 border-primary">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        AI Summary
                      </span>
                    </div>
                    <div className="h-2 bg-primary/20 rounded w-full mb-1"></div>
                    <div className="h-2 bg-primary/20 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-dark-text mb-3">
              Instant Email Summaries
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Get AI-powered summaries of long email threads in seconds
            </p>
          </Card>

          {/* Meeting Location Finder */}
          <Card className="p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border rounded-lg">
            <div className="mb-6">
              <div className="bg-light-background rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                      <span className="font-medium text-dark-text">
                        Team Meeting
                      </span>
                    </div>
                    <span className="text-sm text-text-secondary">2:00 PM</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-accent mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-dark-text mb-1">
                        Conference Room A
                      </div>
                      <div className="text-sm text-text-secondary">
                        123 Main St, Floor 5
                      </div>
                      <div className="mt-2 px-3 py-1 bg-success/10 text-success text-xs rounded-full inline-block">
                        Auto-detected
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      5 attendees
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-dark-text mb-3">
              Smart Location Detection
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Automatically finds and adds meeting locations to your calendar
            </p>
          </Card>

          {/* Promotional Email Deletion */}
          <Card className="md:col-span-2 lg:col-span-1 p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border rounded-lg">
            <div className="mb-6">
              <div className="bg-light-background rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-text-secondary mb-3">
                    Inbox (247)
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-800 rounded w-2/3 mb-1"></div>
                        <div className="h-2 bg-gray-400 rounded w-4/5"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-red-50 rounded border border-red-200 opacity-60">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <TrashIcon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-red-300 rounded w-1/2 mb-1"></div>
                        <div className="h-2 bg-red-200 rounded w-3/4"></div>
                      </div>
                      <div className="text-xs text-red-600 px-2 py-1 bg-red-100 rounded">
                        Promo
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-red-50 rounded border border-red-200 opacity-40">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <TrashIcon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-red-300 rounded w-3/5 mb-1"></div>
                        <div className="h-2 bg-red-200 rounded w-4/5"></div>
                      </div>
                      <div className="text-xs text-red-600 px-2 py-1 bg-red-100 rounded">
                        Ad
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-xs text-success font-medium">
                      ✓ 2 promotional emails auto-deleted
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-dark-text mb-3">
              Auto-Delete Promotions
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              Intelligently removes promotional emails while preserving
              important messages
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

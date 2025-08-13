import React from 'react';
import { Car, Dumbbell, Plane } from 'lucide-react';

interface UseCase {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const useCases: UseCase[] = [
  {
    icon: Car,
    title: 'Morning Drive',
    description:
      'Listen to email summaries and respond using voice commands during your commute to work',
  },
  {
    icon: Dumbbell,
    title: 'Workout Sessions',
    description:
      'Stay on top of urgent emails through AirPods while maintaining your fitness routine',
  },
  {
    icon: Plane,
    title: 'Travel Time',
    description:
      'Manage your inbox hands-free during flights, train rides, or any travel downtime',
  },
];

const TeslaDashboard = () => {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
      {/* Screen glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-30"></div>

      {/* Dashboard frame */}
      <div className="absolute inset-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white text-sm font-medium">Connected</span>
          </div>
          <div className="text-white text-sm">2:47 PM</div>
        </div>

        {/* Main dashboard content */}
        <div className="p-6 space-y-4">
          {/* Email notification */}
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold text-sm">
                New Email Summary
              </h4>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                3 new
              </span>
            </div>
            <p className="text-gray-300 text-xs mb-3">
              Meeting with Johnson moved to 3 PM. Budget approval needed...
            </p>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md transition-colors">
                Reply
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-md transition-colors">
                Dismiss
              </button>
            </div>
          </div>

          {/* Voice control interface */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="text-white font-medium text-sm">
                Voice Command Active
              </span>
            </div>
            <div className="bg-gray-900 rounded-md p-3">
              <p className="text-blue-400 text-xs font-mono">
                "Reply to Sarah: I'll review the proposal and get back to you by
                tomorrow"
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-left transition-colors">
              <div className="text-white text-xs font-medium mb-1">Inbox</div>
              <div className="text-gray-400 text-xs">12 unread</div>
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 text-left transition-colors">
              <div className="text-white text-xs font-medium mb-1">
                Calendar
              </div>
              <div className="text-gray-400 text-xs">Next: 3:00 PM</div>
            </button>
          </div>
        </div>
      </div>

      {/* Corner indicators */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full shadow-lg"></div>
    </div>
  );
};

export const UseCases = () => {
  return (
    <section className="bg-[#1A1A1A] py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="text-white text-4xl font-semibold text-center mb-16 font-inter">
          Achieve Inbox Zero Anywhere, Anytime
        </h2>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Use case cards */}
          <div className="space-y-6">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-900/70 transition-all duration-300 hover:border-gray-600 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-semibold mb-2 font-inter">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed font-inter">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tesla dashboard visualization */}
          <div className="flex justify-center lg:justify-end">
            <TeslaDashboard />
          </div>
        </div>
      </div>
    </section>
  );
};

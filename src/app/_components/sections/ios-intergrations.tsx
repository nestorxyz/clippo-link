import React from 'react';
import { Shield, Headphones, RefreshCw } from 'lucide-react';

export const IOSIntegration = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Face ID Access',
      description:
        'Seamlessly authenticate and access your email with Face ID for maximum security and convenience',
      mockupContent: (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-16 h-16 rounded-full border-2 border-white mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div className="text-sm font-medium mb-2">Face ID</div>
          <div className="text-xs opacity-75 text-center">
            Touch Face ID to authenticate
          </div>
        </div>
      ),
    },
    {
      icon: Headphones,
      title: 'AirPods & CarPlay Ready',
      description:
        'Full integration with AirPods and CarPlay for hands-free email management on the go',
      mockupContent: (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4 flex items-center justify-center">
            <Headphones className="w-8 h-8" />
          </div>
          <div className="text-sm font-medium mb-2">AirPods Connected</div>
          <div className="text-xs opacity-75 text-center">
            Ready for voice commands
          </div>
        </div>
      ),
    },
    {
      icon: RefreshCw,
      title: 'Real-time Sync',
      description:
        "Instant synchronization across all your devices ensures you're always up to date",
      mockupContent: (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div className="text-sm font-medium mb-2">Syncing...</div>
          <div className="text-xs opacity-75 text-center">Updating inbox</div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16 font-inter">
          Built exclusively for iPhone
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group hover:transform hover:translateY-[-4px] transition-all duration-150 ease-in-out"
            >
              {/* iPhone Mockup */}
              <div className="relative mb-8">
                {/* iPhone Frame */}
                <div className="relative w-48 h-96 bg-black rounded-[3rem] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2.5rem] relative overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>

                    {/* Screen Content */}
                    <div className="pt-10 px-4 h-full">
                      {feature.mockupContent}
                    </div>

                    {/* Screen Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-150"></div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Feature Content */}
              <div className="max-w-sm">
                <div className="flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                  {feature.title}
                </h3>

                <p className="text-base text-gray-600 leading-relaxed font-inter">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

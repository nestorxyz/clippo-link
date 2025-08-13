import React from 'react';
import { Shield, Mic, Brain, Eye } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-150 ease-in-out hover:scale-[1.02] group">
      <div className="mb-6 transition-colors duration-150 ease-in-out group-hover:text-primary">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-dark-text mb-4 font-inter">
        {title}
      </h3>
      <p className="text-base text-text-secondary leading-relaxed font-inter">
        {description}
      </p>
    </div>
  );
};

export const CoreFeatures: React.FC = () => {
  const features = [
    {
      icon: <Shield size={48} className="text-primary" />,
      title: 'Apple-Level Encryption',
      description:
        'End-to-end encryption ensures your emails and data remain completely private and secure',
    },
    {
      icon: <Mic size={48} className="text-primary" />,
      title: 'Executive Grade Voice AI',
      description:
        'Advanced AI understands context, tone, and priority to handle emails like your personal assistant',
    },
    {
      icon: <Brain size={48} className="text-primary" />,
      title: 'Learns Your Style',
      description:
        'AI adapts to your communication patterns and preferences for personalized email management',
    },
    {
      icon: <Eye size={48} className="text-primary" />,
      title: 'Understands Email Nuance',
      description:
        'Sophisticated natural language processing detects urgency, importance, and context in every message',
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold text-center text-dark-text mb-16 font-inter">
          Your go-to assistant, saves you hours of time
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

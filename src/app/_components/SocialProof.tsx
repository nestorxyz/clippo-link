import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Quote,
  Star,
  Play,
  Users,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Heart,
} from 'lucide-react';

interface Statistic {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  metric?: string;
}

const statistics: Statistic[] = [
  {
    value: '500K+',
    label: 'Creators Trust Clippo',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    value: '2M+',
    label: 'Videos Created Monthly',
    icon: <Play className="w-8 h-8 text-primary" />,
  },
  {
    value: '98%',
    label: 'User Satisfaction Rate',
    icon: <Heart className="w-8 h-8 text-primary" />,
  },
  {
    value: '150+',
    label: 'Countries Worldwide',
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
  {
    value: '5M+',
    label: 'Hours of Content Generated',
    icon: <Clock className="w-8 h-8 text-primary" />,
  },
  {
    value: '4.9/5',
    label: 'Average Rating',
    icon: <Star className="w-8 h-8 text-primary" />,
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'Clippo transformed my content creation process completely. What used to take me 8 hours now takes just 30 minutes, and my engagement rates have increased by 340% since I started using it.',
    name: 'Sarah Chen',
    title: 'Content Creator',
    company: '@sarahcreates',
    avatar: 'SC',
    metric: '+340% engagement',
  },
  {
    id: 2,
    quote:
      'As a small business owner, I was struggling to create professional videos for my products. Clippo helped me generate over 200 product videos in just one month, leading to a 150% increase in online sales.',
    name: 'Marcus Rodriguez',
    title: 'Founder',
    company: 'Urban Threads',
    avatar: 'MR',
    metric: '+150% sales',
  },
  {
    id: 3,
    quote:
      "We've scaled our client video production by 500% using Clippo. Our team can now deliver high-quality video campaigns faster than ever, and our clients are seeing 2x better ROI on their video marketing.",
    name: 'Jessica Park',
    title: 'Creative Director',
    company: 'Pulse Marketing Agency',
    avatar: 'JP',
    metric: '2x client ROI',
  },
  {
    id: 4,
    quote:
      'My online course completion rates jumped from 45% to 78% after switching to Clippo for my educational content. Students love the engaging, bite-sized video lessons I can now create effortlessly.',
    name: 'Dr. Michael Thompson',
    title: 'Course Creator',
    company: 'LearnTech Academy',
    avatar: 'MT',
    metric: '78% completion rate',
  },
  {
    id: 5,
    quote:
      "Clippo has been a game-changer for our nonprofit's storytelling. We've increased our donation conversion rate by 180% with compelling video stories that used to cost us thousands to produce.",
    name: 'Lisa Patel',
    title: 'Communications Manager',
    company: 'Future Hope Foundation',
    avatar: 'LP',
    metric: '+180% donations',
  },
  {
    id: 6,
    quote:
      'Before Clippo, creating product videos for our 500+ SKUs seemed impossible. Now we have professional videos for our entire catalog, and our conversion rates have improved by 220%.',
    name: 'David Kim',
    title: 'E-commerce Manager',
    company: 'TechGear Pro',
    avatar: 'DK',
    metric: '+220% conversion',
  },
  {
    id: 7,
    quote:
      'As a personal brand strategist, I need to create consistent, high-quality content. Clippo helps me maintain my posting schedule while delivering videos that consistently get 50K+ views.',
    name: 'Amanda Foster',
    title: 'Personal Brand Strategist',
    company: 'Foster Growth',
    avatar: 'AF',
    metric: '50K+ avg views',
  },
  {
    id: 8,
    quote:
      "Clippo saved our startup $50K in video production costs in our first year. We've been able to create compelling investor pitches and product demos that helped us secure Series A funding.",
    name: 'Alex Chen',
    title: 'Co-Founder & CEO',
    company: 'NextWave AI',
    avatar: 'AC',
    metric: '$50K saved',
  },
];

const companyLogos = [
  'TechCorp',
  'InnovateNow',
  'GrowthLabs',
  'CreativeStudio',
  'MarketPro',
  'DigitalEdge',
  'BrandForce',
  'ContentHub',
  'VideoFirst',
  'ScaleUp',
  'MediaFlow',
  'CreatorSpace',
  'NextGen',
  'PulseTech',
  'StoryMakers',
];

export const SocialProof = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/30">
      <div className="container">
        {/* Statistics Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading text-primary mb-6">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Join hundreds of thousands of creators who have transformed their
            content creation process with Clippo
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-heading">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Logos Section */}
        <div className="mb-20">
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Trusted by teams at leading companies
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6 items-center opacity-60">
            {companyLogos.slice(0, 8).map((company, index) => (
              <div
                key={index}
                className="h-12 bg-muted rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <span className="text-xs font-medium text-muted-foreground text-center px-2">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-heading text-primary mb-4">
              Real Results from Real Creators
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how Clippo is helping creators achieve extraordinary
              results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.title}
                      </div>
                      <div className="text-xs text-primary font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  {testimonial.metric && (
                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">
                        {testimonial.metric}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Success Stories Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-heading text-primary mb-6">
            Success Stories in Action
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Watch how our creators achieved remarkable transformations
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((video) => (
              <Card
                key={video}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-primary ml-1" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-semibold mb-1">
                      Creator Success Story #{video}
                    </div>
                    <div className="text-xs opacity-90">
                      How Clippo changed everything
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">
                        Featured Success
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">3:24</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

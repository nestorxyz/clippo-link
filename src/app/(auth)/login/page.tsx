'use client';

import { useEffect, useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import {
  Loader2,
  Bookmark,
  Youtube,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Globe,
  FileText,
  Video,
  Music,
  ShoppingCart,
  BookOpen,
  Camera,
  Code,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import Link from 'next/link';
import Image from 'next/image';

// Floating elements data with different link types and platforms
const floatingElements = [
  { icon: Youtube, text: 'AI Tutorial', color: 'bg-red-500', delay: 0 },
  { icon: Github, text: 'Open Source', color: 'bg-gray-800', delay: 0.2 },
  { icon: Twitter, text: 'Tech News', color: 'bg-blue-400', delay: 0.4 },
  { icon: Linkedin, text: 'Career Tips', color: 'bg-blue-600', delay: 0.6 },
  { icon: Instagram, text: 'Design Inspo', color: 'bg-pink-500', delay: 0.8 },
  { icon: Facebook, text: 'Events', color: 'bg-blue-500', delay: 1.0 },
  { icon: Globe, text: 'Web Resources', color: 'bg-green-500', delay: 1.2 },
  {
    icon: FileText,
    text: 'Research Paper',
    color: 'bg-orange-500',
    delay: 1.4,
  },
  { icon: Video, text: 'Product Demo', color: 'bg-purple-500', delay: 1.6 },
  { icon: Music, text: 'Podcast', color: 'bg-indigo-500', delay: 1.8 },
  { icon: ShoppingCart, text: 'Product', color: 'bg-emerald-500', delay: 2.0 },
  { icon: BookOpen, text: 'Documentation', color: 'bg-amber-500', delay: 2.2 },
  { icon: Camera, text: 'Portfolio', color: 'bg-rose-500', delay: 2.4 },
  { icon: Code, text: 'Code Snippet', color: 'bg-slate-600', delay: 2.6 },
];

export default function AuthPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showElements, setShowElements] = useState(false);
  const [elementPositions, setElementPositions] = useState<
    Array<{ left: number; top: number; fromSide: number }>
  >([]);

  // Generate random positions for floating elements
  useEffect(() => {
    const generateRandomPositions = () => {
      return floatingElements.map(() => {
        const fromSide = Math.floor(Math.random() * 4); // 0: left-top, 1: right-top, 2: right-bottom, 3: left-bottom

        // Define safe zones to avoid the center content area
        // Center area is roughly 30% width and 50% height of the screen
        const centerLeft = 15; // Start of center area (35% from left)
        const centerRight = 65; // End of center area (65% from left)
        const centerTop = 25; // Start of center area (25% from top)
        const centerBottom = 75; // End of center area (75% from top)

        let left, top;

        // Generate position avoiding the center area
        do {
          left = Math.random() * 80 + 10; // 10% to 90% from left
          top = Math.random() * 70 + 15; // 15% to 85% from top
        } while (
          left > centerLeft &&
          left < centerRight &&
          top > centerTop &&
          top < centerBottom
        );

        return {
          left,
          top,
          fromSide,
        };
      });
    };

    setElementPositions(generateRandomPositions());
  }, []);

  useEffect(() => {
    retired-provider.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = retired-provider.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && session) {
      redirect('/dashboard');
    }
  }, [session, loading]);

  // Trigger floating elements animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElements(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-background via-background to-background overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          const position = elementPositions[index];

          if (!position) return null; // Don't render until positions are generated

          // Define the starting position based on fromSide
          const getStartTransform = (fromSide: number) => {
            switch (fromSide) {
              case 0:
                return '-translate-x-full -translate-y-full'; // from top-left
              case 1:
                return 'translate-x-full -translate-y-full'; // from top-right
              case 2:
                return 'translate-x-full translate-y-full'; // from bottom-right
              case 3:
                return '-translate-x-full translate-y-full'; // from bottom-left
              default:
                return '-translate-x-full -translate-y-full';
            }
          };

          return (
            <div
              key={index}
              className={`absolute transition-all duration-[2000ms] ease-out ${
                showElements
                  ? `opacity-100 transform translate-x-0 translate-y-0`
                  : `opacity-0 transform ${getStartTransform(
                      position.fromSide
                    )}`
              }`}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                transitionDelay: `${element.delay}s`,
                animation: showElements
                  ? `float-${index % 3} 6s ease-in-out infinite ${
                      element.delay + 2
                    }s`
                  : 'none',
              }}
            >
              <div
                className={`${element.color} rounded-xl p-3 shadow-lg backdrop-blur-sm bg-opacity-80 border border-white/10`}
              >
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{element.text}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-5 flex flex-col justify-center items-center h-full text-center p-4 sm:p-8">
        <main className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="text-lg mb-5 font-bold mx-auto flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Image
                src="/logo.png"
                alt="DoryAI Logo"
                width={48}
                height={48}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-3xl sm:text-5xl text-[#AFAFAF] font-bold text-foreground tracking-tight mb-4">
              save, tag, and organize links{' '}
              <span className="text-[#EBEBEB]">effortlessly</span>
            </h1>
          </div>

          <AuthForm />

          <footer className="bottom-8 mt-5 text-left text-xs text-[#A5A5A5] max-w-md">
            <p>
              By proceeding, you agree to our{' '}
              <a
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>{' '}
              and acknowledge that our{' '}
              <a
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>{' '}
              applies to you.
            </p>
          </footer>
        </main>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
}

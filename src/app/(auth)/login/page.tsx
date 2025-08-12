'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
          return (
            <div
              key={index}
              className={`absolute transition-all duration-[2000ms] ease-out ${
                showElements
                  ? `opacity-100 transform translate-x-0 translate-y-0`
                  : `opacity-0 transform ${
                      index % 4 === 0
                        ? '-translate-x-full -translate-y-full'
                        : index % 4 === 1
                        ? 'translate-x-full -translate-y-full'
                        : index % 4 === 2
                        ? 'translate-x-full translate-y-full'
                        : '-translate-x-full translate-y-full'
                    }`
              }`}
              style={{
                left: `${10 + ((index * 7) % 80)}%`,
                top: `${15 + ((index * 11) % 70)}%`,
                transitionDelay: `${element.delay}s`,
                animation: showElements
                  ? `float-${index % 3} 6s ease-in-out infinite ${
                      element.delay + 2
                    }s`
                  : 'none',
              }}
            >
              <div
                className={`${element.color} rounded-xl p-3 shadow-lg bg-opacity-80 border border-white/10`}
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
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center p-4 sm:p-8">
        <header className="absolute top-8">
          <Link
            href="/"
            className="text-lg font-bold flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Bookmark className="w-6 h-6" />
            <span>DoryAI</span>
          </Link>
        </header>

        <main className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/80 rounded-2xl p-8 border border-border/50 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Organize your digital life
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              DoryAI helps you save, tag, and organize links effortlessly. Use
              natural language to retrieve anything — from research to side
              projects.
            </p>
          </div>

          <AuthForm />
        </main>

        <footer className="absolute bottom-8 text-xs text-muted-foreground max-w-md px-4">
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

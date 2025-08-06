import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Shirt } from 'lucide-react';
import HeroBackground from './HeroBackground';

const HeroSection = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen text-center p-4 sm:p-8 overflow-hidden">
      <HeroBackground />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent -z-1"></div>

      <div className="z-10">
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight">
            Never lose a link again.
          </h1>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Save links by chatting. Your AI assistant organizes them instantly —
            with context, tags, and memory.
          </p>
        </div>

        <div
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          <Link href="/auth">
            <Button size="lg" className="w-full sm:w-auto animate-pulse-subtle">
              Try Clippo
            </Button>
          </Link>
          <a href="#features" onClick={handleScroll}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              See Examples <ArrowRight className="ml-2" />
            </Button>
          </a>
        </div>

        <div
          className="mt-20 max-w-md mx-auto space-y-3 animate-fade-in"
          style={{ animationDelay: '700ms' }}
        >
          <div
            className="flex items-start gap-3 animate-message-in"
            style={{ animationDelay: '900ms' }}
          >
            <div className="bg-muted rounded-full p-2">
              <Shirt className="text-muted-foreground" />
            </div>
            <div className="bg-card border p-3 rounded-lg text-left">
              <p className="text-sm">Toji gym shirt https://...</p>
            </div>
          </div>
          <div
            className="flex items-start gap-3 justify-end animate-message-in"
            style={{ animationDelay: '1100ms' }}
          >
            <div className="bg-primary/20 border border-primary/50 p-3 rounded-lg text-left">
              <p className="text-sm">
                Saved to 🏋️ Geekwear — tags: gym, anime, toji
              </p>
            </div>
            <div className="bg-card rounded-full p-2">
              <MessageSquare className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

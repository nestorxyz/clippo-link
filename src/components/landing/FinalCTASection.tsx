import Link from 'next/link';
import { Button } from '@/components/ui/button';

const FinalCTASection = () => {
  return (
    <section className="py-24 px-4 sm:px-8 text-center">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Ready to try DoryAI?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Give it a go — it's like having your own memory bot.
        </p>
        <div className="mt-8">
          <Link href="/auth">
            <Button size="lg" className="animate-pulse-subtle">
              Try DoryAI Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;

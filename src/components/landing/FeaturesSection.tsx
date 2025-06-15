
import { Brain, FolderKanban, MessageSquare, Search, Smile, Tags } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Chat-first interface',
    description: 'Save and retrieve links with natural chat commands.',
  },
  {
    icon: Tags,
    title: 'Smart tagging',
    description: 'AI extracts topics and places into searchable tags automatically.',
  },
  {
    icon: FolderKanban,
    title: 'Personalized structure',
    description: 'Create your own categories like “Startup ideas” or “Joshi – Gift ideas”.',
  },
  {
    icon: Search,
    title: 'Instant search',
    description: 'Ask “show me marketing stuff for LukAI” — Clippo fetches it.',
  },
  {
    icon: Brain,
    title: 'Context-aware memory',
    description: 'Clippo remembers why you saved something — not just the link.',
  },
  {
    icon: Smile,
    title: 'Natural input',
    description: 'Use plain language. Clippo gets it. Even emojis if you want 🧃✨',
  },
];

const FeaturesSection = ({ id }: { id: string }) => {
  return (
    <section id={id} className="py-20 px-4 sm:px-8 bg-card border-y">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need, nothing you don't.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Clippo is packed with powerful features to make organizing your digital life effortless and intuitive.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="p-6 bg-background rounded-lg border animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

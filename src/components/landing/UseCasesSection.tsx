
import { Card, CardContent } from '@/components/ui/card';

const useCases = [
  'Build a second brain for your ideas.',
  'Store research for school, work, or content.',
  'Save links from friends, X, or Reddit — and never lose them.',
  'Organize personal inspiration: travel, gifts, hobbies.',
  'Collect tutorials, components, tools, tweets.',
];

const UseCasesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What will you build with it?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Clippo is a flexible tool for all kinds of thinkers.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4">
          {useCases.map((useCase, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <Card className="hover:border-primary transition-colors hover:scale-[1.02] transform duration-300">
                <CardContent className="p-4">
                  <p className="text-center">{useCase}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;

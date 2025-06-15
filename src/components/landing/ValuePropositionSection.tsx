
import { BrainCircuit } from "lucide-react";

const ValuePropositionSection = () => {
  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What is Clippo?</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Clippo is your personal link assistant, powered by AI. Just drop a link in the chat. Tell Clippo what it’s about. Done — it’s remembered, tagged, and ready to find later.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Forget folders, tabs, and bookmarks. Now, you just talk.
          </p>
        </div>
        <div className="flex justify-center items-center animate-fade-in" style={{ animationDelay: '200ms'}}>
          <div className="relative p-8 rounded-full bg-card border">
            <BrainCircuit size={100} className="text-primary" />
            <div className="absolute inset-0 rounded-full bg-primary/10 -z-10 animate-pulse-subtle"></div>
            <div className="absolute -inset-4 rounded-full bg-primary/5 -z-20 animate-pulse-subtle" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValuePropositionSection;

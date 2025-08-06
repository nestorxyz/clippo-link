import { Navigation } from './_components/Navigation';
import { Hero } from './_components/Hero';
import { WhatIsClippo } from './_components/WhatIsClippo';
import { Features } from './_components/Features';
import { UseCases } from './_components/UseCases';
import { ClippoInAction } from './_components/ClippoInAction';
import { ForPeopleLikeYou } from './_components/ForPeopleLikeYou';
import { FinalCTA } from './_components/FinalCTA';
import { Footer } from './_components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="what-is-clippo">
          <WhatIsClippo />
        </section>

        <section id="features">
          <Features />
        </section>

        <section id="use-cases">
          <UseCases />
        </section>

        <section id="in-action">
          <ClippoInAction />
        </section>

        <section id="for-you">
          <ForPeopleLikeYou />
        </section>

        <section id="final-cta">
          <FinalCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}

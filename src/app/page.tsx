import type { Metadata } from 'next';
import { NavigationHeader } from './_components/sections/navigation';
import { HeroSection } from './_components/sections/hero';
import { FeaturesDemo } from './_components/sections/features-demos';
import { PricingSection } from './_components/sections/pricing';
import { Footer } from './_components/sections/footer';
import { ClippoInAction } from '@/app/_components/ClippoInAction';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="bg-white text-black ">
      <NavigationHeader />
      <main>
        <HeroSection />
        <FeaturesDemo />
        <ClippoInAction />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

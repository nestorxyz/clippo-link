import { NavigationHeader } from './_components/sections/navigation';
import { HeroSection } from './_components/sections/hero';
import { FeaturesDemo } from './_components/sections/features-demos';
import { CoreFeatures } from './_components/sections/core-features';
import { UseCases } from './_components/sections/use-cases';
import { IOSIntegration } from './_components/sections/ios-intergrations';
import { CustomerReviews } from './_components/sections/reviews';
import { PricingSection } from './_components/sections/pricing';
import { Footer } from './_components/sections/footer';
import { ClippoInAction } from '@/app/_components/ClippoInAction';
import { WhatsAppCTA } from './_components/sections/whatsapp-cta';

export default function Home() {
  return (
    <div className="bg-white text-black ">
      <NavigationHeader />
      <main>
        <HeroSection />
        <FeaturesDemo />
        {/* <CoreFeatures />
        <UseCases />
        <IOSIntegration />
        <CustomerReviews />
       */}
        <ClippoInAction />
        <PricingSection />
        <WhatsAppCTA />
      </main>
      <Footer />
    </div>
  );
}

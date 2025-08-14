'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getWhatsappBotLinkWithMessage } from '@/lib/chat';

interface WhatsAppCTAProps {
  className?: string;
}

// A dark, glossy banner with copy on the left and the phone mock on the right.
export const WhatsAppCTA = ({ className = '' }: WhatsAppCTAProps) => {
  const href = getWhatsappBotLinkWithMessage(
    "Let's start saving links with DoryAI"
  );

  return (
    <section
      id="whatsapp-cta"
      aria-label="whatsapp-cta"
      className={`relative overflow-hidden rounded-lg lg:pb-20 pb-72 mx-4 py-20 px-6 ${className}`}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(1200px 600px at 20% 10%, #1c1c1c 0%, #0f0f10 60%, #0a0a0b 100%)',
        }}
      />
      {/* Subtle contour lines */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.02) 35%, transparent 40%),\n             radial-gradient(circle at 10% 120%, rgba(255,255,255,0.06) 0, transparent 45%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Copy */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6">
              Ready to never lose a link again?
            </h2>
            <p className="text-base font-light md:text-lg text-white/70 mb-10 max-w-xl">
              Works right inside WhatsApp — save, tag, and organize anything in
              seconds.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-light justify-center bg-[#007AFF] hover:bg-[#0056CC] text-white px-6 py-3 rounded-md transition-colors duration-150"
              >
                Start saving links on WhatsApp
              </Link>
            </div>
          </div>

          {/* Phone image */}
          <div className="hidden lg:flex right-0 absolute -bottom-[380px] w-full max-w-96 h-[620px] lg:h-[660px]">
            <Image
              src="/landing/whatsapp-chat.png"
              alt="Save links in WhatsApp with DoryAI"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>
      <div className="absolute lg:hidden -bottom-[380px] w-full h-[620px] lg:h-[560px]">
        <Image
          src="/landing/whatsapp-chat.png"
          alt="Save links in WhatsApp with DoryAI"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain drop-shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
        />
      </div>
    </section>
  );
};

export default WhatsAppCTA;

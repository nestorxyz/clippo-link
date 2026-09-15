'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = ({ className }: HeroSectionProps) => {
  return (
    <section
      className={`py-20 px-6 overflow-hidden relative ${className}`}
      style={{
        background: 'linear-gradient(180deg,#d1d1d157,#f8f8f866)',
      }}
    >
      {/* Decorative background from Framer */}
      <div
        className="framer-5r9pn4"
        data-framer-name="Blur Shadow Box"
        aria-hidden
        style={{
          alignContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flex: 'none',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '10px',
          height: 'min-content',
          justifyContent: 'center',
          left: '50%',
          minHeight: '1062px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          top: '-200px',
          transform: 'translate(-50%)',
          width: '135%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="framer-w9zz7f"
          data-framer-name="Blur Shadow1"
          style={{
            WebkitFilter: 'blur(16px)',
            background: 'linear-gradient(180deg,#fff,#fff0)',
            borderRadius: '100%',
            filter: 'blur(16px)',
            flex: 'none',
            height: '1190px',
            left: 'calc(7.374935533780322% - 98px / 2)',
            position: 'absolute',
            top: 'calc(40.01883239171377% - 1190px / 2)',
            width: '98px',
            transform: 'rotate(-56deg)',
          }}
        ></div>
        <div
          className="framer-3lbbhj"
          data-framer-name="Blur Shadow2"
          style={{
            WebkitFilter: 'blur(16px)',
            background: 'linear-gradient(180deg,#fff,#fff0)',
            borderRadius: '100%',
            filter: 'blur(16px)',
            flex: 'none',
            height: '1190px',
            left: 'calc(7.374935533780322% - 98px / 2)',
            position: 'absolute',
            top: 'calc(40.01883239171377% - 1190px / 2)',
            width: '98px',
            transform: 'rotate(-56deg)',
          }}
        ></div>
        <div
          className="framer-1spyi1i"
          data-framer-name="Blur Shadow3"
          style={{
            WebkitFilter: 'blur(13.5px)',
            background: 'linear-gradient(180.14780039541495deg,#fff,#fff0)',
            borderRadius: '100%',
            filter: 'blur(13.5px)',
            flex: 'none',
            height: '1190px',
            left: 'calc(52.08333333333336% - 98px / 2)',
            position: 'absolute',
            top: 'calc(50.00000000000002% - 1190px / 2)',
            width: '98px',
            transform: 'rotate(-45deg)',
          }}
        ></div>
        <div
          className="framer-1nmpm86"
          data-framer-name="Blur Shadow4"
          style={{
            WebkitFilter: 'blur(13.5px)',
            background: 'linear-gradient(180.14780039541495deg,#fff,#fff0)',
            borderRadius: '100%',
            filter: 'blur(13.5px)',
            flex: 'none',
            height: '1190px',
            left: 'calc(52.08333333333336% - 98px / 2)',
            position: 'absolute',
            top: 'calc(50.00000000000002% - 1190px / 2)',
            width: '98px',
            transform: 'rotate(32deg)',
          }}
        ></div>
        <div
          className="framer-a6nesr"
          data-framer-name="Blur Shadow5"
          style={{
            WebkitFilter: 'blur(16px)',
            background:
              'linear-gradient(180deg,#fff 38.72994087837838%,#fff0 86%)',
            borderRadius: '100%',
            filter: 'blur(16px)',
            flex: 'none',
            height: '771px',
            left: 'calc(65.60283687943264% - 63px / 2)',
            position: 'absolute',
            top: 'calc(41.05461393596989% - 771px / 2)',
            width: '63px',
            transform: 'rotate(39deg)',
          }}
        ></div>
        <div
          className="framer-c38dfo"
          data-framer-name="Blur Shadow6"
          style={{
            WebkitFilter: 'blur(16px)',
            background: 'linear-gradient(180deg,#fff,#fff0)',
            borderRadius: '100%',
            filter: 'blur(16px)',
            flex: 'none',
            height: '1189px',
            left: 'calc(89.47911294481695% - 98px / 2)',
            position: 'absolute',
            top: 'calc(36.34651600753298% - 1189px / 2)',
            width: '98px',
            transform: 'rotate(51deg)',
          }}
        ></div>
      </div>
      <div
        className="container mx-auto max-w-6xl mt-[44px]"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Main Content */}
        <div className="text-center mb-16">

          {/* Hero Headline */}
          <h1 className="text-4xl !z-99 md:text-5xl lg:text-6xl font-bold text-dark-text mb-6 leading-tight">
            Never lose a link again.
          </h1>

          {/* Descriptive Paragraph */}
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed mb-12">
            Save links by chatting. Your AI assistant organizes them instantly —
            with context, tags, and memory.
          </p>

          <Link
            href="/sign-in"
            className="inline-flex items-center px-6 py-3 bg-black text-white text-lg font-medium rounded-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out"
          >
            Try DoryAI
          </Link>
        </div>

        {/* Video Section */}
        <div className="mx-auto">
          <div className="relative bg-light-background rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
              src="/product.png"
              alt="DoryAI dashboard"
              className="inset-0 h-auto w-full"
              width={3014}
              height={1572}
              priority
            />

            {/* Video Overlay (optional, for styling) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

            {/* Play Button Overlay (optional, for better UX) */}
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Play
                  className="w-6 h-6 text-primary ml-1"
                  fill="currentColor"
                />
              </div>
            </div> */}
          </div>

          {/* Video Caption */}
          <p className="text-center text-sm text-muted mt-4">
            DoryAI automatically organizes your saved links with AI.
          </p>
        </div>
      </div>
    </section>
  );
};

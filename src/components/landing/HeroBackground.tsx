
import { Github, Twitter, Rss, Figma, Dribbble, Youtube, Bot, Link2 } from 'lucide-react';

const icons = [
  { component: Github, className: 'top-[10%] left-[15%] w-8 h-8', delay: '0s', colorClass: 'text-white/30' },
  { component: Twitter, className: 'top-[20%] right-[10%] w-10 h-10', delay: '1s', colorClass: 'text-white/50' },
  { component: Rss, className: 'bottom-[15%] left-[25%] w-7 h-7', delay: '2s', colorClass: 'text-white/20' },
  { component: Figma, className: 'bottom-[25%] right-[20%] w-9 h-9', delay: '0.5s', colorClass: 'text-white/40' },
  { component: Bot, className: 'top-[40%] left-[45%] w-10 h-10', delay: '1.5s', colorClass: 'text-primary' },
  { component: Dribbble, className: 'bottom-[5%] right-[40%] w-8 h-8', delay: '2.5s', colorClass: 'text-white/30' },
  { component: Youtube, className: 'top-[60%] left-[10%] w-9 h-9', delay: '3s', colorClass: 'text-white/40' },
  { component: Link2, className: 'bottom-[35%] right-[45%] w-7 h-7', delay: '3.5s', colorClass: 'text-primary/80' },
];

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-magic-purple/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>

      {/* The "orbits" */}
      <div className="absolute inset-[10%] sm:inset-[20%] rounded-full border border-white/5 animate-spin-slow"></div>
      <div className="absolute inset-[25%] sm:inset-[35%] rounded-full border border-white/5 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>

      {/* Floating Icons */}
      {icons.map((icon, index) => {
        const IconComponent = icon.component;
        return (
          <div key={index} className={`absolute animate-float ${icon.className}`} style={{ animationDelay: icon.delay }}>
            <IconComponent className={`w-full h-full ${icon.colorClass}`} />
          </div>
        );
      })}
    </div>
  );
};

export default HeroBackground;

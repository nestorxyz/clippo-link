'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Examples', href: '#in-action' },
  { label: 'For You', href: '#for-you' },
];

export const Navigation = ({ className }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNavClick(item.href)}
          className={`
            relative px-4 py-2 text-sm font-medium transition-all duration-200 font-body
            text-slate-600 hover:text-slate-900
            ${mobile ? 'block w-full text-left text-base py-3' : ''}
            hover:scale-105 active:scale-95
          `}
        >
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
            : 'bg-transparent'
        }
        ${className || ''}
      `}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('#hero')}
              className="flex items-center gap-2 text-2xl font-bold text-slate-900 font-heading tracking-tight hover:scale-105 transition-transform duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Clippo
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItems />
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-body font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 rounded-xl px-6"
              onClick={() => window.open('https://app.clippo.ai', '_blank')}
            >
              Try Clippo
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 p-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xl font-bold text-slate-900 font-heading">
                        Clippo
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="flex-1 py-6">
                    <nav className="space-y-1">
                      <NavItems mobile />
                    </nav>
                  </div>

                  {/* Mobile CTA Button */}
                  <div className="py-6 border-t border-slate-200">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-body font-medium rounded-xl"
                      onClick={() => {
                        window.open('https://app.clippo.ai', '_blank');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Try Clippo
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

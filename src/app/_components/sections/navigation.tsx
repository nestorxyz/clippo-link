'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const NavigationHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 text-black">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/isologo-black.png"
              alt="DoryAI Logo"
              width={120}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#pricing"
              className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            >
              Pricing
            </Link>
            <Link
              href="/#features"
              className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            >
              Features
            </Link>
            <a
              href="mailto:nmamanipantoja@gmail.com"
              className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            >
              Contact
            </a>
          </nav>

          {/* App Store Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-[#EA64D3] text-white text-base font-medium rounded-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-light-background">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/#features"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <a
                href="mailto:nmamanipantoja@gmail.com"
                className="text-base font-medium text-dark-text hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-[#EA64D3] text-white text-base font-medium rounded-md hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

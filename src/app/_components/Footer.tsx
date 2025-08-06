import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Github, Linkedin, Mail, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Clippo
                </h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your AI-powered link assistant that organizes the web through
                natural conversation. Never lose a link again.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-slate-600">
                <Mail className="w-4 h-4 mr-3 text-indigo-500" />
                <span className="text-sm">hello@clippo.ai</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com/clippo"
                className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 p-2 hover:bg-indigo-50 rounded-lg"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/clippo"
                className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 p-2 hover:bg-indigo-50 rounded-lg"
                aria-label="Star us on GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/clippo"
                className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 p-2 hover:bg-indigo-50 rounded-lg"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-slate-900 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-slate-900 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Newsletter */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-slate-900 mb-4">
              Stay Updated
            </h4>
            <ul className="space-y-3 mb-8">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div>
              <h5 className="font-heading text-base font-semibold text-slate-900 mb-3">
                Get updates
              </h5>
              <p className="text-sm text-slate-600 mb-4">
                New features and productivity tips delivered to your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="text-sm border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                99.9% Uptime
              </span>
              <span>SOC 2 Certified</span>
              <span>GDPR Compliant</span>
              <span>Privacy-First</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>© 2024 Clippo AI, Inc.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for curious minds</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

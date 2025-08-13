import { Twitter, Linkedin, Instagram, Apple } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* App Download CTA Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Download April today
              </h2>
              <p className="text-gray-400 text-lg">
                Available exclusively on the App Store
              </p>
            </div>

            {/* App Store Button */}
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg border border-gray-700 transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <Apple className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">April</h3>
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              The executive-grade email assistant that learns your style and
              saves you hours every day. Built exclusively for iPhone with
              enterprise-level security.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-150 ease-in-out hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-150 ease-in-out hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-150 ease-in-out hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 April. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

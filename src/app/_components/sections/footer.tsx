import { Mail, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white text-[#0A0A0A]">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand / Description */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/isologo-black.png"
                alt="April logo"
                width={200}
                height={40}
              />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              DoryAI — your AI link assistant that keeps every idea, resource,
              and inspiration organized and ready when you need it.
            </p>

            {/* Social Icons */}
            {/* <div className="flex items-center gap-6 mt-6">
              <a
                href="#"
                aria-label="Email"
                className="text-[#0A0A0A] hover:text-gray-700 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-[#0A0A0A] hover:text-gray-700 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="X"
                className="text-[#0A0A0A] hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M4 4l16 16M20 4L4 20" />
                </svg>
              </a>
            </div> */}
          </div>

          {/* Company Links */}
          <div className="lg:col-span-6 lg:justify-self-end">
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Terms of use
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@doryai.com"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <p className="text-sm text-gray-500">
            © Misfit Labs LLC. 2025 - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

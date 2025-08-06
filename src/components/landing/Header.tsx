import Link from 'next/link';
import { Bookmark } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-8 bg-gradient-to-b from-background to-transparent">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-lg font-bold flex items-center gap-2 text-foreground"
        >
          <Bookmark className="w-6 h-6 text-primary" />
          <span>Clippo</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

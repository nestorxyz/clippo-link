import * as React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { User, Link as LinkIcon } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
interface HeaderProps {
  session: Session | null;
}
const Header = ({ session }: HeaderProps) => {
  return (
    <header className="px-6 h-16 flex items-center shrink-0">
      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 mr-auto"
      >
        <LinkIcon className="h-6 w-6 text-primary" />
        <span className="font-semibold tracking-tight text-2xl">DoryAI</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href={session ? '/account' : '/auth'}>
          <Button variant="ghost">
            <User className="h-5 w-5 mr-2" />
            Account
          </Button>
        </Link>
      </div>
    </header>
  );
};
export default Header;

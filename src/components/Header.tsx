
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from './ui/button';
import { User, Link as LinkIcon } from 'lucide-react';
import { Session } from '@retired-provider/retired-provider-js';

interface HeaderProps {
    session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
    return (
        <header className="px-6 h-16 flex items-center border-b shrink-0">
            <RouterLink to="/dashboard" className="flex items-center justify-center gap-2 mr-auto">
                <LinkIcon className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight">Link Organizer</span>
            </RouterLink>
            <div className="flex items-center gap-2">
                <RouterLink to={session ? "/account" : "/auth"}>
                    <Button variant="ghost">
                        <User className="h-5 w-5 mr-2" />
                        Account
                    </Button>
                </RouterLink>
            </div>
        </header>
    )
}

export default Header;

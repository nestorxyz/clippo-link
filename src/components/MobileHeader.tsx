import React, { useMemo } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { usePlan } from '@/hooks/usePlan';
import { useUser, useClerk, useAuth } from '@clerk/nextjs';
import { env } from '@/env';
import { useQueryState, parseAsStringLiteral } from 'nuqs';

const settingsTabs = ['profile', 'integrations', 'billing'] as const;

interface MobileHeaderProps {}

const MobileHeader: React.FC<MobileHeaderProps> = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [, setSettingsTab] = useQueryState(
    'settings',
    parseAsStringLiteral(settingsTabs)
  );

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const avatarUrl = user?.imageUrl || null;
  const avatarFallback = useMemo(
    () => (email ? email.charAt(0).toUpperCase() : 'U'),
    [email]
  );
  const { data: plan } = usePlan();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Failed to sign out', e);
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-20 bg-background border-b">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/isologo.png" alt=".ai" width={120} height={24} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
              <Avatar className="h-8 w-8">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="avatar" />
                ) : (
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
              {email}
            </div>
            <DropdownMenuSeparator />
            {plan?.plan === 'premium' ? (
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const token = await getToken({ template: 'convex' });
                    if (!token) throw new Error('No session');
                    const res = await fetch(
                      `${env.NEXT_PUBLIC_BACKEND_URL || ''}/api/billing/portal`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const json = await res.json();
                    const url = json?.url as string | undefined;
                    if (url) window.location.href = url;
                    else toast.error('No portal URL available');
                  } catch (e) {
                    console.error(e);
                    toast.error('Failed to open billing portal');
                  }
                }}
                className="cursor-pointer"
              >
                <span>Billing</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('open-pricing'));
                  } catch (e) {
                    window.location.href =
                      '/sign-in?plan=monthly&intent=checkout&msg=areYouReadyToAction';
                  }
                }}
                className="cursor-pointer"
              >
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                <span>Upgrade</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setSettingsTab('profile')}
              className="cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default MobileHeader;

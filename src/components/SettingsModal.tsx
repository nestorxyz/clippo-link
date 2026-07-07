'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User as UserIcon, LogOut } from 'lucide-react';
import { AccountForm } from '@/components/AccountForm';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePlan } from '@/hooks/usePlan';
import { useUserContext } from '@/context/UserContext';
import { toast } from 'sonner';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQueryState, parseAsStringLiteral } from 'nuqs';

const settingsTabs = ['profile', 'billing'] as const;
type SettingsTab = (typeof settingsTabs)[number];

export default function SettingsModal() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [settingsTab, setSettingsTab] = useQueryState(
    'settings',
    parseAsStringLiteral(settingsTabs),
  );
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [planLabel, setPlanLabel] = useState<'free' | 'premium' | null>(null);
  const { data: plan } = usePlan();

  const open = settingsTab !== null;
  const activeTab: SettingsTab = settingsTab ?? 'profile';
  const onClose = () => setSettingsTab(null);

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const displayName = user?.fullName || user?.firstName || '';
  const displayAvatarUrl = user?.imageUrl || null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const title =
    activeTab === 'profile' ? 'Profile' : 'Billing';
  const subtitle =
    activeTab === 'profile'
      ? 'Manage your profile'
      : 'Manage your subscription and plan';

  useEffect(() => {
    if (plan) setPlanLabel(plan.plan);
  }, [plan]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 top-0 z-[60] flex flex-col md:flex-row h-full w-full bg-[#0F0F0F] overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {/* Sidebar */}
          <aside className="hidden-scrollbar flex-none w-full md:w-[320px] md:h-full overflow-x-auto md:overflow-y-auto bg-transparent px-4 md:px-6 border-b md:border-b-0 md:border-r border-[#1D1D1D] transition-colors shrink-0">
            <div className="md:ml-auto flex md:w-48 flex-row md:flex-col py-4 md:py-12 gap-2 md:gap-0 h-full items-center md:items-stretch pr-12 md:pr-0">
              <nav className="flex flex-row md:flex-col md:space-y-6 text-sm gap-2 md:gap-0 flex-1">
                <div className="flex-none">
                  <div className="px-2 text-[11px] uppercase tracking-wider text-[#646363] mb-2 hidden md:block">
                    Personal Settings
                  </div>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-[#1D1D1D] text-white'
                        : 'text-[#A5A5A5] hover:bg-[#1D1D1D] hover:text-white'
                    }`}
                    onClick={() => setSettingsTab('profile')}
                  >
                    Profile
                  </button>
                </div>
                <div className="flex-none">
                  <div className="px-2 text-[11px] uppercase tracking-wider text-[#646363] mb-2 hidden md:block">
                    App Settings
                  </div>
                  <button
                    className={`w-full text-left px-4 md:px-2 py-2 md:py-1.5 rounded-md transition-colors ${
                      activeTab === 'billing'
                        ? 'bg-[#1D1D1D] text-white'
                        : 'text-[#A5A5A5] hover:bg-[#1D1D1D] hover:text-white'
                    }`}
                    onClick={() => setSettingsTab('billing')}
                  >
                    Billing
                  </button>
                </div>
              </nav>

              <div className="mt-0 md:mt-auto pt-0 md:pt-4 flex items-center md:items-start ml-auto md:ml-0">
                <Button
                  variant="ghost"
                  className="w-auto md:w-full justify-start text-[#A5A5A5] hover:text-white hover:bg-[#1D1D1D] px-3 md:px-4"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Log out</span>
                </Button>
              </div>
            </div>
          </aside>

          <div className="fixed right-4 top-4 md:right-10 md:top-10 z-20 flex flex-col items-center justify-center gap-1.5">
            <button
              className="rounded-full p-2 hover:bg-[#1D1D1D] bg-[#111111] md:bg-transparent shadow-sm border border-[#1D1D1D] md:border-transparent"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="hidden md:block text-[10px] uppercase tracking-wider text-[#7A7A7A]">
              ESC
            </span>
          </div>
          {/* Content */}
          <div className="hidden-scrollbar relative h-full flex-1 overflow-y-scroll transition-colors">
            <div className="flex min-h-full w-full max-w-[900px] flex-col px-4 md:px-12 py-8 md:py-12 pb-32">
              {/* Title */}
              <div className="pt-8">
                <h1 className="text-xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>

              {/* Header banner */}
              {activeTab === 'profile' && (
                <div className="pt-6">
                  <div className="relative rounded-xl border border-[#1D1D1D] bg-gradient-to-b from-[#121212] to-[#0F0F0F] p-4 md:p-6 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                      <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-primary/30 shrink-0">
                        {displayAvatarUrl && !avatarLoadError ? (
                          <AvatarImage
                            src={displayAvatarUrl}
                            alt="avatar"
                            onError={() => setAvatarLoadError(true)}
                          />
                        ) : (
                          <AvatarFallback className="text-xl">
                            <UserIcon className="h-1/2 w-1/2 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="text-xl font-semibold">
                          {displayName || 'Your Account'}
                        </div>
                        <div className="text-sm text-[#A5A5A5]">{email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="py-8">
                {activeTab === 'profile' && (
                  <div className="max-w-xl">
                    <AccountForm showSignOutButton={false} />
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="max-w-xl space-y-4">
                    <div className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-medium">Your Plan</div>
                          <div className="text-sm text-muted-foreground">
                            {planLabel === 'premium' ? 'Premium' : 'Free'}
                          </div>
                        </div>
                      </div>
                      {plan?.plan === 'premium' && (
                        <div className="text-sm text-muted-foreground mt-2">
                          {plan.trialEndsAt
                            ? `Trial ends on ${new Date(
                                plan.trialEndsAt,
                              ).toLocaleDateString()}`
                            : plan.renewsAt
                              ? `Renews on ${new Date(
                                  plan.renewsAt,
                                ).toLocaleDateString()}`
                              : null}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <PortalButton />
                      <Button
                        variant="secondary"
                        onClick={() =>
                          window.dispatchEvent(new CustomEvent('open-pricing'))
                        }
                      >
                        {planLabel === 'premium' ? 'Change plan' : 'Upgrade'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PortalButton() {
  const { plan } = useUserContext();
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    if (plan?.managePortalUrl) {
      window.location.href = plan.managePortalUrl;
      return;
    }
    toast.error('No billing portal available. Please contact support.');
  };

  return (
    <Button
      variant="default"
      disabled={loading || !plan?.managePortalUrl}
      onClick={handleOpen}
    >
      Manage subscription
    </Button>
  );
}

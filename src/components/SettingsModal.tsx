'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  User as UserIcon,
  MessageCircle,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { AccountForm } from '@/components/AccountForm';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PhoneVerification } from '@/components/PhoneVerification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePlan } from '@/hooks/usePlan';
import { useUserContext } from '@/context/UserContext';
import { useUser, useClerk, useAuth } from '@clerk/nextjs';
import { env } from '@/env';
import { useQueryState, parseAsStringLiteral } from 'nuqs';

const settingsTabs = ['profile', 'integrations', 'billing'] as const;
type SettingsTab = (typeof settingsTabs)[number];

export default function SettingsModal() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [settingsTab, setSettingsTab] = useQueryState(
    'settings',
    parseAsStringLiteral(settingsTabs),
  );
  const { phoneStatus, refresh: refreshPhoneStatus } = usePhoneVerification();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
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
    activeTab === 'profile'
      ? 'Profile'
      : activeTab === 'integrations'
        ? 'Integrations'
        : 'Billing';
  const subtitle =
    activeTab === 'profile'
      ? 'Manage your profile'
      : activeTab === 'integrations'
        ? 'Connect your apps'
        : 'Manage your subscription and plan';
  useEffect(() => {
    if (plan) setPlanLabel(plan.plan);
  }, [plan]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 top-0 z-modal flex h-full w-full bg-[#0F0F0F] z-50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {/* Sidebar */}
          <aside
            className="hidden-scrollbar h-full flex-1 overflow-y-scroll bg-gray-75 px-6 transition-colors"
            style={{
              flexBasis: '320px',
            }}
          >
            <div className="ml-auto flex w-48 flex-col py-12">
              <nav className="space-y-6 text-sm">
                <div>
                  <div className="px-2 text-[11px] uppercase tracking-wider text-[#646363] mb-2">
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
                <div>
                  <div className="px-2 text-[11px] uppercase tracking-wider text-[#646363] mb-2">
                    App Settings
                  </div>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-md ${
                      activeTab === 'integrations'
                        ? 'bg-[#1D1D1D] text-white'
                        : 'text-[#A5A5A5] hover:bg-[#1D1D1D] hover:text-white'
                    }`}
                    onClick={() => setSettingsTab('integrations')}
                  >
                    Integrations
                  </button>
                  <button
                    className={`mt-2 w-full text-left px-2 py-1.5 rounded-md ${
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

              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#A5A5A5] hover:text-white hover:bg-[#1D1D1D]"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </aside>

          <div className="fixed right-10 top-10 z-20 flex flex-col items-center justify-center gap-1.5">
            <button
              className="rounded-full p-2 hover:bg-[#1D1D1D]"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="text-[10px] uppercase tracking-wider text-[#7A7A7A]">
              ESC
            </span>
          </div>
          {/* Content */}
          <div
            className="hidden-scrollbar relative h-full flex-1 overflow-y-scroll transition-colors"
            style={{
              flexBasis: '888px',
            }}
          >
            {/* Close with ESC label */}
            <div className="flex min-h-full w-full min-w-[520px] max-w-[900px] flex-col px-12 py-12">
              {/* Title */}
              <div className="pt-8">
                <h1 className="text-xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>

              {/* Header banner */}
              {activeTab === 'profile' && (
                <div className="pt-6">
                  <div className="relative rounded-xl border border-[#1D1D1D] bg-gradient-to-b from-[#121212] to-[#0F0F0F] p-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 ring-2 ring-primary/30">
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
                    <AccountForm
                      showWhatsAppSection={false}
                      showSignOutButton={false}
                    />
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="max-w-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          WhatsApp Integration
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Connect your WhatsApp to use DoryAI on mobile
                        </p>
                      </div>
                      {phoneStatus?.phoneVerified ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Connected
                        </div>
                      ) : (
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {phoneStatus?.phoneVerified ? (
                      <div className="rounded-lg border p-4 space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Phone Number:</span>{' '}
                          {phoneStatus.phoneNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You can now use DoryAI via WhatsApp! Send any message
                          to start.
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowPhoneVerification(true)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Connect WhatsApp
                      </Button>
                    )}

                    <PhoneVerification
                      isOpen={showPhoneVerification}
                      onClose={() => setShowPhoneVerification(false)}
                      onVerified={(phoneNumber) => {
                        setShowPhoneVerification(false);
                        refreshPhoneStatus();
                        toast.success('WhatsApp Connected!', {
                          description: `Your phone number ${phoneNumber} has been linked.`,
                        });
                      }}
                    />
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
    // If we have a stored portal URL, use it
    if (plan?.managePortalUrl) {
      window.location.href = plan.managePortalUrl;
      return;
    }

    // Fallback: If no URL but we have a subscription ID, we could construct a URL or show a toast.
    // The user mentioned "portal url is just the subscription id", which might imply a specific URL structure.
    // However, usually it's a full URL.
    // For now, if no URL is present, we assume there's no active subscription to manage or it's not ready.
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

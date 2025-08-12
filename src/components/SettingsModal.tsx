'use client';

import { useEffect, useMemo, useState } from 'react';
import { Session } from '@retired-provider/retired-provider-js';
import { retired-provider } from '@/integrations/retired-provider/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Settings,
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

type SettingsTab = 'profile' | 'integrations';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  session: Session;
}

export default function SettingsModal({
  open,
  onClose,
  session,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [fullName, setFullName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { phoneStatus, refresh: refreshPhoneStatus } = usePhoneVerification();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const email = session.user.email ?? '';
  const displayName = useMemo(() => {
    return (
      fullName ||
      (session.user.user_metadata?.full_name as string | undefined) ||
      (session.user.user_metadata?.name as string | undefined) ||
      ''
    );
  }, [fullName, session.user.user_metadata]);

  const displayAvatarUrl = useMemo(() => {
    return (
      avatarUrl ||
      (session.user.user_metadata?.avatar_url as string | undefined) ||
      (session.user.user_metadata?.picture as string | undefined) ||
      null
    );
  }, [avatarUrl, session.user.user_metadata]);

  const avatarFallback = useMemo(
    () => (email ? email.charAt(0).toUpperCase() : 'U'),
    [email]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      const { data, error } = await retired-provider
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', session.user.id)
        .single();
      if (!cancelled && !error && data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || null);
      }
    }
    if (open) loadProfile();
    return () => {
      cancelled = true;
    };
  }, [open, session.user.id]);

  const title = activeTab === 'profile' ? 'Profile' : 'Integrations';
  const subtitle =
    activeTab === 'profile' ? 'Manage your profile' : 'Connect your apps';

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
                    onClick={() => setActiveTab('profile')}
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
                    onClick={() => setActiveTab('integrations')}
                  >
                    Integrations
                  </button>
                </div>
              </nav>

              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-[#A5A5A5] hover:text-white hover:bg-[#1D1D1D]"
                  onClick={() => retired-provider.auth.signOut()}
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
                      session={session}
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
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

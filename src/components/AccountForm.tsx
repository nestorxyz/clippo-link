'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { AvatarUploader } from './AvatarUploader';
import { PhoneVerification } from './PhoneVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { useUser, useClerk } from '@clerk/nextjs';

interface AccountFormProps {
  showWhatsAppSection?: boolean;
  showSignOutButton?: boolean;
}

export const AccountForm = ({
  showWhatsAppSection = true,
  showSignOutButton = true,
}: AccountFormProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const { phoneStatus, refresh: refreshPhoneStatus } = usePhoneVerification();

  // Initial load
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
    }
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ');

      await user.update({
        firstName: firstName || '',
        lastName: lastName || '',
      });

      toast.success('Profile updated!', {
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast.error('Error updating profile', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  if (!isLoaded) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.primaryEmailAddress?.emailAddress || ''}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Avatar Uploader: Note that currently this uploads to Convex. Clerk user image is separate. */}
        {/* If we want to use Clerk avatar, we might need a different uploader or sync mechanism. */}
        {/* For now, preserving existing Convex uploader which updates local user record. */}
        <div>
          <Label className="mb-2 block">Avatar</Label>
          <AvatarUploader
            uid={user?.id || null}
            url={user?.imageUrl || null} // Displaying Clerk image as fallback/current
            size={80}
            onUpload={(storageId) => {
              // This is called after Convex update.
              // Ideally we updates Clerk image too, but user.setProfileImage expects a file.
              // AvatarUploader handles the file upload to Convex.
              // We'll just toast success.
            }}
          />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
          </Button>
        </div>
      </form>

      {showWhatsAppSection && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">WhatsApp Integration</Label>
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
                You can now use DoryAI via WhatsApp! Send any message to start.
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
        </div>
      )}

      {showSignOutButton && (
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}

      {showWhatsAppSection && (
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
      )}
    </div>
  );
};

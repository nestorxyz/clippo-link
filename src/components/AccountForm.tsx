import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { AvatarUploader } from './AvatarUploader';
import { PhoneVerification } from './PhoneVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';

export const AccountForm = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const { phoneStatus, refresh: refreshPhoneStatus } = usePhoneVerification();

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url`)
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  const updateProfile = async (newAvatarUrl?: string) => {
    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      full_name: fullName,
      avatar_url: newAvatarUrl !== undefined ? newAvatarUrl : avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      toast.error('Error updating profile', { description: error.message });
    } else {
      toast.success('Profile updated!', {
        description: 'Your profile has been successfully updated.',
      });
    }
    setLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <div className="space-y-6">
      <AvatarUploader
        uid={session.user.id}
        url={avatarUrl}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile(url);
        }}
      />
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={session.user.email} disabled />
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

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
          </Button>
        </div>
      </form>

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

      <Button
        variant="outline"
        className="w-full"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </Button>

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
  );
};

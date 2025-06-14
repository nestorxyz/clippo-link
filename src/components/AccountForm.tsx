
import { useState, useEffect } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Session } from '@retired-provider/retired-provider-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AvatarUploader } from './AvatarUploader';

export const AccountForm = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await retired-provider
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

    const { error } = await retired-provider.from('profiles').upsert(updates);

    if (error) {
      toast.error('Error updating profile', { description: error.message });
    } else {
      toast.success('Profile updated!', { description: 'Your profile has been successfully updated.' });
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
          <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
          </Button>
        </div>
      </form>

      <Button variant="outline" className="w-full" onClick={() => retired-provider.auth.signOut()}>
        Sign Out
      </Button>
    </div>
  );
};

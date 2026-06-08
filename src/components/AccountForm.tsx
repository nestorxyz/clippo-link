'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AvatarUploader } from './AvatarUploader';
import { useUser, useClerk } from '@clerk/nextjs';

interface AccountFormProps {
  showSignOutButton?: boolean;
}

export const AccountForm = ({
  showSignOutButton = true,
}: AccountFormProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');

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

        {/* Avatar Uploader */}
        <div>
          <Label className="mb-2 block">Avatar</Label>
          <AvatarUploader
            uid={user?.id || null}
            url={user?.imageUrl || null}
            size={80}
            onUpload={(storageId) => {
              // Handled by AvatarUploader
            }}
          />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Update Profile'}
          </Button>
        </div>
      </form>

      {showSignOutButton && (
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}
    </div>
  );
};

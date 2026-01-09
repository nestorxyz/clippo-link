import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

export const AvatarUploader = ({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) => {
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar);

  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      if (!uid) {
        throw new Error('You must be logged in to upload an avatar.');
      }

      const file = event.target.files[0];

      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. POST the file
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // 3. Update user avatar
      await updateAvatar({ storageId });

      // Convex updates the user record, and the UI should reactively update if it subscribes to user data.
      // For now, we assume the parent handles the URL update or we might not need onUpload to pass the URL back if we use real-time data.
      // But preserving onUpload signature:
      // Note: we might not claim the URL immediately unless we optimistically update or fetch it.
      // However, onUpload is likely used to trigger a refresh or local state update.
      onUpload(storageId);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading avatar', {
        description: (error as Error).message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar
        style={{ height: size, width: size }}
        className="ring-2 ring-primary/50"
      >
        <AvatarImage src={url || undefined} alt="Avatar" />
        <AvatarFallback
          style={{ height: size, width: size, fontSize: size / 2 }}
        >
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="single_avatar" className="cursor-pointer">
          <Button asChild variant="outline">
            <span>
              {uploading ? (
                <>
                  {' '}
                  <Loader2 className="animate-spin mr-2" /> Uploading...{' '}
                </>
              ) : (
                'Upload Avatar'
              )}
            </span>
          </Button>
        </Label>
        <Input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single_avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

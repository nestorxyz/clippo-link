
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', (error as Error).message);
    }
  }

  useEffect(() => {
    if (url) {
      downloadImage(url)
    } else {
      setAvatarUrl(null);
    }
  }, [url]);

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
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      toast.error('Error uploading avatar', { description: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar style={{ height: size, width: size }} className="ring-2 ring-primary/50">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
        <AvatarFallback style={{ height: size, width: size, fontSize: size / 2 }}>
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div>
        <Label htmlFor="single_avatar" className="cursor-pointer">
          <Button asChild variant="outline">
            <span>
              {uploading ? <> <Loader2 className="animate-spin mr-2"/> Uploading... </> : 'Upload Avatar'}
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

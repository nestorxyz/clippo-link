import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { previewImageCandidates } from '@/lib/link-preview';
import { getPlatformByUrl } from '@/lib/social-platforms';

interface LinkPreviewArtworkProps {
  url: string;
  imgPreview?: string;
}

export const LinkPreviewArtwork = ({
  url,
  imgPreview,
}: LinkPreviewArtworkProps) => {
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const candidates = previewImageCandidates(url, imgPreview);
  const image = candidates.find((candidate) => !failedImages.includes(candidate));
  const platform = getPlatformByUrl(url);

  return image ? (
    // Saved preview hosts vary, so image optimization cannot use a fixed remote allowlist.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() =>
        setFailedImages((failed) => image && !failed.includes(image)
          ? [...failed, image]
          : failed)
      }
      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center text-white/70',
        platform?.color ?? 'bg-[#202020]',
      )}
    >
      <span className="scale-150 opacity-70" aria-hidden="true">
        {platform?.icon ?? <LinkIcon className="h-8 w-8" />}
      </span>
    </div>
  );
};

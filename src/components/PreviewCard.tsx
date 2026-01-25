import React, { useState } from 'react';
import { Link } from '@/lib/types';
import { Star, Clock } from 'lucide-react';
import { useConvexMutation } from '@/hooks/use-convex-mutation';
import { api } from 'convex/_generated/api';
import { cn, domainFromUrl } from '@/lib/utils';

interface PreviewCardProps {
  link: Link;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ link }) => {
  const [hideImage, setHideImage] = useState(false);
  const { mutate: toggleFavorite } = useConvexMutation(
    api.links.toggleFavorite,
  );
  const { mutate: toggleReadLater } = useConvexMutation(
    api.links.toggleReadLater,
  );

  const imageOpacity = 'opacity-80';

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col h-48 bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite({ linkId: link.id as any });
          }}
          className={cn(
            'p-1.5 rounded-full hover:bg-black/50 transition-colors',
            link.isFavorite
              ? 'text-yellow-400'
              : 'text-white/50 hover:text-white',
          )}
        >
          <Star className={cn('h-4 w-4', link.isFavorite && 'fill-current')} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleReadLater({ linkId: link.id as any });
          }}
          className={cn(
            'p-1.5 rounded-full hover:bg-black/50 transition-colors',
            link.isReadLater
              ? 'text-blue-400'
              : 'text-white/50 hover:text-white',
          )}
        >
          <Clock
            className={cn('h-4 w-4', link.isReadLater && 'fill-current')}
          />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 p-3 mt-auto">
        <div className="text-sm font-semibold line-clamp-2 mb-1 text-white">
          {link.title || link.description || 'Untitled'}
        </div>
        <div className="text-xs text-gray-300 truncate">
          {domainFromUrl(link.url)}
        </div>
      </div>
      {link.imgPreview && !hideImage ? (
        <img
          src={link.imgPreview}
          alt={link.title || 'Preview Image'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHideImage(true)}
          className={cn(
            'absolute block inset-0 h-full w-full object-cover z-0 pointer-events-none transform-gpu transition-transform duration-500 ease-in-out group-hover:scale-110',
            imageOpacity,
          )}
        />
      ) : null}
    </a>
  );
};

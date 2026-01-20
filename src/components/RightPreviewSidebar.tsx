import React, { useMemo, useState } from 'react';
import { Category, Link } from '@/lib/types';
import { Star, Clock, Bookmark } from 'lucide-react';
import { useConvexMutation } from '@/hooks/use-convex-mutation';
import { api } from 'convex/_generated/api';
import { cn } from '@/lib/utils';
import SocialMediaPlaceholders from '@/components/SocialMediaPlaceholders';

interface RightPreviewSidebarProps {
  categories: Category[];
  selectedSubCategoryId: string | null;
  viewMode: 'inbox' | 'favorites' | 'read-later' | 'category';
}

const RightPreviewSidebar: React.FC<RightPreviewSidebarProps> = ({
  categories,
  selectedSubCategoryId,
  viewMode,
}) => {
  const links: Link[] = useMemo(() => {
    if (!categories || categories.length === 0) return [] as Link[];

    let filtered: Link[] = [];

    if (viewMode === 'favorites') {
      filtered = categories
        .flatMap((c) => c.subCategories.flatMap((s) => s.links))
        .filter((l) => l.isFavorite);
    } else if (viewMode === 'read-later') {
      filtered = categories
        .flatMap((c) => c.subCategories.flatMap((s) => s.links))
        .filter((l) => l.isReadLater);
    } else if (viewMode === 'category' && selectedSubCategoryId) {
      for (const c of categories) {
        const sub = c.subCategories.find((s) => s.id === selectedSubCategoryId);
        if (sub) {
          filtered = sub.links;
          break;
        }
      }
    } else {
      // Inbox or fallback
      filtered = categories.flatMap((c) =>
        c.subCategories.flatMap((s) => s.links),
      );
    }

    return filtered
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )
      .slice(0, 150);
  }, [categories, selectedSubCategoryId, viewMode]);

  return (
    <aside className="h-screen w-[360px] flex-shrink-0 bg-background">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3">
          {links.length === 0 ? (
            <SocialMediaPlaceholders />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {links.map((link) => (
                <PreviewCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const domainFromUrl = (url: string): string => {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const PreviewCard: React.FC<{ link: Link }> = ({ link }) => {
  const [hideImage, setHideImage] = useState(false);
  const { mutate: toggleFavorite } = useConvexMutation(
    api.links.toggleFavorite,
  );
  const { mutate: toggleReadLater } = useConvexMutation(
    api.links.toggleReadLater,
  );

  return (
    <div className="relative group/card">
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
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-xl relative overflow-hidden bg-card p-3 pb-1 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#cdcccc] mb-16">
            <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-[10px] uppercase">
              {domainFromUrl(link.url)[0] || '?'}
            </div>
            <span className="truncate">{domainFromUrl(link.url)}</span>
          </div>
          <div className="mt-20">
            <div className="text-sm font-semibold line-clamp-2 mb-1">
              {link.title || link.description || 'Untitled'}
            </div>
          </div>
        </div>
        {link.imgPreview && !hideImage ? (
          <img
            src={link.imgPreview}
            alt={link.title || 'Preview Image'}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setHideImage(true)}
            className="absolute opacity-80 inset-0 h-full w-full rounded-xl object-cover z-0 pointer-events-none transform-gpu transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : null}
      </a>
    </div>
  );
};

export default RightPreviewSidebar;

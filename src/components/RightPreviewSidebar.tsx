import React, { useMemo } from 'react';
import { Category, Link } from '@/lib/types';
import SocialMediaPlaceholders from '@/components/SocialMediaPlaceholders';
import { PreviewCard } from '@/components/PreviewCard';

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
                <PreviewCard key={link.id} link={link} variant="sidebar" />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightPreviewSidebar;

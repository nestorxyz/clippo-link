import React, { useMemo } from 'react';
import { Category, Link as LinkType } from '@/lib/types';
import { PreviewCard } from '@/components/PreviewCard';

interface LinksGridProps {
  categories: Category[];
  selectedSubCategoryId?: string | null;
}

const LinksGrid: React.FC<LinksGridProps> = ({
  categories,
  selectedSubCategoryId = null,
}) => {
  const links: LinkType[] = useMemo(() => {
    if (!categories || categories.length === 0) return [] as LinkType[];
    if (!selectedSubCategoryId) {
      const all = categories.flatMap((c) =>
        c.subCategories.flatMap((s) => s.links),
      );
      return all
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    for (const c of categories) {
      const sub = c.subCategories.find((s) => s.id === selectedSubCategoryId);
      if (sub) {
        return sub.links
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
      }
    }
    return [] as LinkType[];
  }, [categories, selectedSubCategoryId]);

  return (
    <div className="p-3 pb-24 md:pb-6">
      <div className="grid grid-cols-2 gap-3">
        {links.map((link) => (
          <PreviewCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
};

export default LinksGrid;

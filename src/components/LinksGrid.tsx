import React, { useMemo } from 'react';
import { Category, Link as LinkType } from '@/lib/types';

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
        c.subCategories.flatMap((s) => s.links)
      );
      return all
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    for (const c of categories) {
      const sub = c.subCategories.find((s) => s.id === selectedSubCategoryId);
      if (sub) {
        return sub.links
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

const domainFromUrl = (url: string): string => {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const PreviewCard: React.FC<{ link: LinkType }> = ({ link }) => {
  const [hideImage, setHideImage] = React.useState(false);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl relative overflow-hidden bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs text-[#cdcccc] mb-16">
          <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-[10px] uppercase">
            {domainFromUrl(link.url)[0] || '?'}
          </div>
          <span className="truncate">{domainFromUrl(link.url)}</span>
        </div>
        <div className="mt-10">
          <div className="text-sm font-semibold line-clamp-2 mb-1">
            {link.description || link.title || 'Untitled'}
          </div>
          <div className="text-xs text-[#cdcccc] truncate">
            {domainFromUrl(link.url)}
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
          className="absolute opacity-50 inset-0 h-full w-full rounded-xl object-cover z-0 pointer-events-none transform-gpu transition-transform duration-300 ease-out group-hover:scale-105"
        />
      ) : null}
    </a>
  );
};

export default LinksGrid;

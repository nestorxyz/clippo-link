import React, { useMemo } from 'react';
import { Category, Link } from '@/lib/types';

interface RightPreviewSidebarProps {
  categories: Category[];
  selectedSubCategoryId: string | null;
}

const RightPreviewSidebar: React.FC<RightPreviewSidebarProps> = ({
  categories,
  selectedSubCategoryId,
}) => {
  const links: Link[] = useMemo(() => {
    if (!categories || categories.length === 0) return [] as Link[];
    if (!selectedSubCategoryId) {
      // show all links, newest first
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
    return [] as Link[];
  }, [categories, selectedSubCategoryId]);

  return (
    <aside className="h-screen w-[360px] flex-shrink-0 bg-background">
      <div className="flex flex-col h-full">
        <div className="px-4 h-12 shrink-0 flex items-center">
          <h2 className="text-sm font-medium tracking-tight">Previews</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {links.map((link) => (
              <PreviewCard key={link.id} link={link} />
            ))}
          </div>
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
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-16">
        <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-[10px] uppercase">
          {domainFromUrl(link.url)[0] || '?'}
        </div>
        <span className="truncate">{domainFromUrl(link.url)}</span>
      </div>
      <div className="mt-10">
        <div className="text-sm font-semibold line-clamp-2 mb-1">
          {link.description || link.title || 'Untitled'}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {domainFromUrl(link.url)}
        </div>
      </div>
    </a>
  );
};

export default RightPreviewSidebar;

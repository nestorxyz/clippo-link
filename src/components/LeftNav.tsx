import React from 'react';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LeftNavProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSubCategory: (
    subCategoryId: string | null,
    categoryId: string | null
  ) => void;
}

const LeftNav: React.FC<LeftNavProps> = ({
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  onSelectSubCategory,
}) => {
  return (
    <aside className="h-screen w-[252px] flex-shrink-0 bg-background">
      <div className="flex flex-col h-full">
        <div className="px-4 h-12 shrink-0 flex items-center">
          <h2 className="text-sm font-medium tracking-tight">DoryAI</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {categories.map((category) => (
            <div key={category.id} className="mb-2">
              <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {category.name}
              </div>
              <div className="space-y-1">
                {category.subCategories.map((sub) => {
                  const isSelected = selectedSubCategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectCategory(category.id);
                        onSelectSubCategory(sub.id, category.id);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center justify-between',
                        'hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {sub.links.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftNav;

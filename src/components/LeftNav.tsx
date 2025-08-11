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
              <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-[#646363]">
                {category.name}
              </div>
              <div className="space-y-1 px-1">
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
                        'w-full text-left px-3 py-1.5 text-[#A5A5A5] text-sm rounded-md flex items-center justify-between',
                        'hover:bg-[#3A3A3A] hover:text-white',
                        isSelected && 'bg-[#3A3A3A] text-white'
                      )}
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="ml-2 text-xs text-[#A5A5A5]">
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

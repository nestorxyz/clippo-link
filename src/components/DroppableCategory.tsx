import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category, SubCategory } from '@/lib/types';
import DroppableSubCategory from './DroppableSubCategory';

const categoryIcons: {
  [key: string]: React.ElementType;
} = {
  lukAI: () => <span>⭐</span>,
  joshi: () => <span>👤</span>,
  Work: () => <span>💼</span>,
  default: () => <span>📁</span>,
};

const CategoryIcon = ({ name }: { name: string }) => {
  const Icon = categoryIcons[name] || categoryIcons.default;
  return <Icon />;
};

interface DroppableCategoryProps {
  category: Category;
  isOpen: boolean;
  isDragging?: boolean;
  deletingLinkId?: string | null;
  onToggle: () => void;
  onLinkDelete?: (linkId: string) => void;
}

const DroppableCategory: React.FC<DroppableCategoryProps> = ({
  category,
  isOpen,
  isDragging = false,
  deletingLinkId,
  onToggle,
  onLinkDelete,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `category-${category.id}`,
    data: {
      type: 'category',
      category,
    },
  });

  return (
    <div>
      {/* Category Header - Droppable */}
      <div
        ref={setNodeRef}
        className={cn(
          'w-full flex items-center justify-between text-left p-2 rounded-md transition-all duration-200',
          'hover:bg-secondary/50',
          isOver && 'bg-blue-100 ring-2 ring-blue-300 ring-opacity-50'
        )}
      >
        <button onClick={onToggle} className="flex items-center gap-2 flex-1">
          <CategoryIcon name={category.name} />
          <span className="font-medium">{category.name}</span>
        </button>
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
        />
      </div>

      {/* Subcategories */}
      {isOpen && (
        <div className="pl-6 space-y-1 py-1">
          {category.subCategories.map((sub) => (
            <DroppableSubCategory
              key={sub.id}
              subCategory={sub}
              categoryId={category.id}
              isDragging={isDragging}
              deletingLinkId={deletingLinkId}
              onLinkDelete={onLinkDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DroppableCategory;

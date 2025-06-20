import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubCategory } from '@/lib/types';
import DraggableLink from './DraggableLink';

interface DroppableSubCategoryProps {
  subCategory: SubCategory;
  categoryId: string;
  isDragging?: boolean;
  onLinkDelete?: (linkId: string) => void;
}

const DroppableSubCategory: React.FC<DroppableSubCategoryProps> = ({
  subCategory,
  categoryId,
  isDragging = false,
  onLinkDelete
}) => {
  const {
    isOver,
    setNodeRef
  } = useDroppable({
    id: `subcategory-${subCategory.id}`,
    data: {
      type: 'subcategory',
      subCategory,
      categoryId,
    },
  });

  return (
    <div>
      {/* Subcategory Header - Droppable */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md transition-all duration-200",
          "hover:bg-secondary/50 text-muted-foreground",
          isOver && "bg-green-100 ring-2 ring-green-300 ring-opacity-50"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>{subCategory.name}</span>
      </div>

      {/* Links - Hide during drag to keep accordions collapsed */}
      {!isDragging && (
        <div className="draggable-links-container">
          {subCategory.links.map((link) => (
            <DraggableLink
              key={link.id}
              link={link}
              onDelete={onLinkDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DroppableSubCategory;
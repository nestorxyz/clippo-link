import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Link2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';
import { Link, Tag } from '@/lib/types';

interface DraggableLinkProps {
  link: Link;
  onDelete?: (linkId: string) => void;
}

const DraggableLink: React.FC<DraggableLinkProps> = ({ link, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: link.id,
    data: {
      type: 'link',
      link,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(link.id);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-link group ml-6 pr-2 py-1.5 rounded-md hover:bg-secondary/50 transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105 z-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Link Content */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground/80 group-hover:text-foreground transition-colors flex-1 min-w-0"
        >
          <Link2 className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{link.description || link.title}</span>
        </a>

        {/* Action Buttons - Vertical Stack */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-0.5 ml-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            onMouseDown={handleDragStart}
            className="drag-handle p-1 hover:bg-blue-100 rounded transition-colors cursor-grab active:cursor-grabbing"
            title="Drag to move"
          >
            <GripVertical className="h-3 w-3 text-muted-foreground hover:text-blue-600" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Delete link"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {link.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {link.tags.map((tag: Tag) => (
            <Badge
              key={tag.id}
              variant={tag.color ? "default" : "secondary"}
              className="text-xs font-normal"
              style={
                tag.color
                  ? {
                      backgroundColor: tag.color,
                      color: getContrastColor(tag.color),
                      borderColor: 'transparent',
                    }
                  : {}
              }
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableLink;
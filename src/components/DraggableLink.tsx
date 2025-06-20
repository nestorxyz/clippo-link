import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Link2, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getContrastColor } from '@/lib/colorUtils';
import { Link, Tag } from '@/lib/types';

interface DraggableLinkProps {
  link: Link;
  deletingLinkId?: string | null;
  onDelete?: (linkId: string) => void;
}

const DraggableLink: React.FC<DraggableLinkProps> = ({
  link,
  deletingLinkId,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: link.id,
      data: {
        type: 'link',
        link,
      },
      disabled: deletingLinkId === link.id, // Disable dragging when deleting
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(link.id);
    }
  };

  const isDeleting = deletingLinkId === link.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ml-6 pr-2 py-1.5 rounded-md hover:bg-secondary/50 transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
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

        {/* Action Buttons - Only show when not dragging */}
        {!isDragging && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-0.5 ml-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              disabled={isDeleting}
              className="p-1 hover:bg-blue-100 rounded transition-colors cursor-grab active:cursor-grabbing disabled:opacity-50 disabled:cursor-not-allowed"
              title="Drag to move"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground hover:text-blue-600" />
            </button>

            {/* Delete Button with Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-1 hover:bg-red-100 rounded transition-colors"
                  disabled={isDeleting}
                  title="Delete link"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-600" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Link</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this link? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Tags */}
      {link.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {link.tags.map((tag: Tag) => (
            <Badge
              key={tag.id}
              variant={tag.color ? 'default' : 'secondary'}
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

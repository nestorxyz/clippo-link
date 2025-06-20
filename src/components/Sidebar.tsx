import { Category, Tag, Link, SubCategory } from '@/lib/types';
import {
  ChevronRight,
  Folder,
  Link2,
  Star,
  User,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';
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
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import DroppableCategory from './DroppableCategory';
import DraggableLink from './DraggableLink';

interface SidebarProps {
  categories: Category[];
  isCollapsed: boolean;
  toggleSidebar: () => void;
  session: Session | null;
  isMobile?: boolean;
}

const categoryIcons: {
  [key: string]: React.ElementType;
} = {
  lukAI: Star,
  joshi: User,
  Work: Briefcase,
  default: Folder,
};

const CategoryIcon = ({ name }: { name: string }) => {
  const Icon = categoryIcons[name] || categoryIcons.default;
  return <Icon className="h-4 w-4" />;
};

const Sidebar = ({
  categories,
  isCollapsed,
  toggleSidebar,
  session,
  isMobile = false,
}: SidebarProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>(
    categories.map((c) => c.id)
  );
  const [draggedLink, setDraggedLink] = useState<Link | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleCategory = (id: string) => {
    if (isDragging) return; // Prevent accordion toggle during drag
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Check if a category should be open (either manually opened or hovered during drag)
  const isCategoryOpen = (categoryId: string) => {
    if (isDragging) {
      return hoveredCategoryId === categoryId;
    }
    return openCategories.includes(categoryId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setIsDragging(true);
    setHoveredCategoryId(null);

    // Close all accordions when drag starts
    setOpenCategories([]);

    // Store the dragged link for overlay
    if (active.data.current?.type === 'link') {
      setDraggedLink(active.data.current.link);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (!isDragging) {
      return;
    }

    if (!over) {
      // Add a delay before closing the category to allow movement between elements
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategoryId(null);
      }, 250); // 250ms delay
      return;
    }

    const dropTarget = over.data.current;

    if (dropTarget?.type === 'category') {
      setHoveredCategoryId(dropTarget.category.id);
    } else if (dropTarget?.type === 'subcategory') {
      // If hovering over a subcategory, keep its parent category open
      setHoveredCategoryId(dropTarget.categoryId);
    } else {
      // Not hovering over a category or subcategory, add delay before closing
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategoryId(null);
      }, 250);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setIsDragging(false);
    setDraggedLink(null);
    setHoveredCategoryId(null);

    if (!over || !session) return;

    const draggedLinkData = active.data.current;
    const dropTarget = over.data.current;

    if (draggedLinkData?.type !== 'link') return;

    const link = draggedLinkData.link;
    let targetSubCategoryId: string | null = null;

    try {
      if (dropTarget?.type === 'subcategory') {
        // Dropped on subcategory
        targetSubCategoryId = dropTarget.subCategory.id;
      } else if (dropTarget?.type === 'category') {
        // Dropped on category - need to find or create "general" subcategory
        const category = dropTarget.category;

        // Check if category has a "general" subcategory
        const generalSubCategory = category.subCategories.find(
          (sub: SubCategory) => sub.name.toLowerCase() === 'general'
        );

        if (!generalSubCategory) {
          // Create "general" subcategory
          const { data: newSubCategory, error: subCategoryError } =
            await supabase
              .from('sub_categories')
              .insert({
                name: 'general',
                category_id: category.id,
                user_id: session.user.id,
              })
              .select('id')
              .single();

          if (subCategoryError) throw subCategoryError;
          targetSubCategoryId = newSubCategory.id;
        } else {
          targetSubCategoryId = generalSubCategory.id;
        }
      }

      if (targetSubCategoryId && targetSubCategoryId !== link.subCategoryId) {
        // Update the link's subcategory
        const { error } = await supabase
          .from('links')
          .update({ sub_category_id: targetSubCategoryId })
          .eq('id', link.id);

        if (error) throw error;

        // Show success toast
        toast.success('Link moved successfully!');

        // Invalidate and refetch categories
        queryClient.invalidateQueries({
          queryKey: ['categories', session.user.id],
        });
      }
    } catch (error: unknown) {
      console.error('Error moving link:', error);
      toast.error('Failed to move link', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  };

  const handleLinkDelete = async (linkId: string) => {
    if (!session) return;

    setDeletingLinkId(linkId);
    try {
      // Delete link-tag associations first
      const { error: linkTagsError } = await supabase
        .from('link_tags')
        .delete()
        .eq('link_id', linkId);

      if (linkTagsError) throw linkTagsError;

      // Delete the link
      const { error: linkError } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', session.user.id);

      if (linkError) throw linkError;

      toast.success('Link deleted successfully!');

      // Invalidate and refetch categories
      queryClient.invalidateQueries({
        queryKey: ['categories', session.user.id],
      });
    } catch (error: unknown) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setDeletingLinkId(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('h-full w-full')}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between py-0 border-b">
          {!isCollapsed && (
            <h2 className="tracking-tight font-normal text-base">Links</h2>
          )}
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {categories.map((category) => (
              <DroppableCategory
                key={category.id}
                category={category}
                isOpen={isCategoryOpen(category.id)}
                isCollapsed={isCollapsed}
                isDragging={isDragging}
                deletingLinkId={deletingLinkId}
                onToggle={() => toggleCategory(category.id)}
                onLinkDelete={handleLinkDelete}
              />
            ))}

            {/* Drag Overlay */}
            <DragOverlay>
              {draggedLink && (
                <div className="bg-white rounded-md shadow-lg border p-2 rotate-2 opacity-90">
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="h-3 w-3" />
                    <span className="truncate">
                      {draggedLink.description || draggedLink.title}
                    </span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

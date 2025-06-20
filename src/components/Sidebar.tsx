import { Category, Tag } from '@/lib/types';
import { ChevronRight, Folder, Link2, Star, User, Briefcase, PanelLeftClose, PanelLeftOpen, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Session } from '@retired-provider/retired-provider-js';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';
import { 
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { retired-provider } from '@/integrations/retired-provider/client';
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
  default: Folder
};

const CategoryIcon = ({
  name
}: {
  name: string;
}) => {
  const Icon = categoryIcons[name] || categoryIcons.default;
  return <Icon className="h-4 w-4" />;
};

const Sidebar = ({
  categories,
  isCollapsed,
  toggleSidebar,
  session,
  isMobile = false
}: SidebarProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>(categories.map(c => c.id));
  const [draggedLink, setDraggedLink] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setIsDragging(true);
    
    // Close all accordions when drag starts
    setOpenCategories([]);
    
    // Store the dragged link for overlay
    if (active.data.current?.type === 'link') {
      setDraggedLink(active.data.current.link);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggedLink(null);

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
        let generalSubCategory = category.subCategories.find(
          (sub: any) => sub.name.toLowerCase() === 'general'
        );

        if (!generalSubCategory) {
          // Create "general" subcategory
          const { data: newSubCategory, error: subCategoryError } = await retired-provider
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
        const { error } = await retired-provider
          .from('links')
          .update({ sub_category_id: targetSubCategoryId })
          .eq('id', link.id);

        if (error) throw error;

        // Show success toast
        toast.success('Link moved successfully!');

        // Invalidate and refetch categories
        queryClient.invalidateQueries({
          queryKey: ['categories', session.user.id]
        });
      }
    } catch (error: any) {
      console.error('Error moving link:', error);
      toast.error('Failed to move link', {
        description: error.message
      });
    }
  };

  const handleLinkDelete = async (linkId: string) => {
    if (!session) return;

    try {
      // Delete link-tag associations first
      const { error: linkTagsError } = await retired-provider
        .from('link_tags')
        .delete()
        .eq('link_id', linkId);

      if (linkTagsError) throw linkTagsError;

      // Delete the link
      const { error: linkError } = await retired-provider
        .from('links')
        .delete()
        .eq('id', linkId);

      if (linkError) throw linkError;

      toast.success('Link deleted successfully!');

      // Invalidate and refetch categories
      queryClient.invalidateQueries({
        queryKey: ['categories', session.user.id]
      });
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link', {
        description: error.message
      });
    }
  };

  return (
    <div className={cn("h-full w-full")}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between py-0 border-b">
          {!isCollapsed && <h2 className="tracking-tight font-normal text-base">Links</h2>}
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {categories.map(category => (
              <DroppableCategory
                key={category.id}
                category={category}
                isOpen={openCategories.includes(category.id)}
                isCollapsed={isCollapsed}
                isDragging={isDragging}
                onToggle={() => toggleCategory(category.id)}
                onLinkDelete={handleLinkDelete}
              />
            ))}

            {/* Drag Overlay */}
            <DragOverlay>
              {draggedLink && (
                <div className="drag-overlay bg-white rounded-md shadow-lg border p-2 rotate-2 opacity-90">
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="h-3 w-3" />
                    <span className="truncate">{draggedLink.description || draggedLink.title}</span>
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
# Drag & Drop Implementation Guide

## Overview

This implementation provides a modern, accessible drag and drop system for moving links between categories and subcategories in the sidebar. The system is built using `@dnd-kit` and follows the existing retired-provider/TanStack Query patterns.

## Key Features

✅ **Intuitive UX**: Hover to reveal drag handle + delete button  
✅ **Clean Interface**: Accordions collapse during drag for focused interaction  
✅ **Auto-subcategory**: Creates "general" subcategory when dropped on category  
✅ **Visual Feedback**: Animated drop zones with color-coded feedback  
✅ **Mobile Support**: Touch-friendly with proper activation constraints  
✅ **Optimistic Updates**: Real-time UI updates with database sync  
✅ **Error Handling**: Toast notifications following existing patterns  

## Components Architecture

```
Sidebar (DnD Context)
├── DroppableCategory (Blue drop zones)
│   └── DroppableSubCategory (Green drop zones)
│       └── DraggableLink (Hover controls)
└── DragOverlay (Visual feedback during drag)
```

## User Flow

1. **Hover Link** → Drag handle + delete button appear (vertical stack)
2. **Start Drag** → All accordions collapse, clean interface
3. **Drag Over** → Drop zones highlight (blue=category, green=subcategory)  
4. **Drop** → Database updates, toast feedback, UI refreshes
5. **Auto-create** → If dropped on category without subcategories, creates "general"

## Database Operations

### Moving Links
```sql
UPDATE links 
SET sub_category_id = :new_subcategory_id 
WHERE id = :link_id
```

### Auto-creating Subcategories
```sql
INSERT INTO sub_categories (name, category_id, user_id) 
VALUES ('general', :category_id, :user_id)
```

### Link Deletion
```sql
-- 1. Delete link-tag associations
DELETE FROM link_tags WHERE link_id = :link_id

-- 2. Delete the link
DELETE FROM links WHERE id = :link_id
```

## Animation System

### CSS Classes
- `draggable-link`: Hover lift effect on links
- `drag-handle`: Progressive disclosure for drag handles  
- `drop-zone-active`: Blue pulsing animation for categories
- `subcategory-drop-zone`: Green pulsing animation for subcategories
- `drag-overlay`: Enhanced visual feedback during drag
- `accordion-content`: Smooth collapse transitions

### Visual Feedback
- **Category Drop**: Blue border with pulsing animation
- **Subcategory Drop**: Green border with pulsing animation  
- **Drag Overlay**: Rotated, scaled copy with blur effect
- **Link Hover**: Subtle lift + shadow

## Touch Support

Configured with optimized activation constraints:
- **Pointer**: 8px movement threshold
- **Touch**: 200ms delay + 5px tolerance
- **Keyboard**: Standard sortable coordinates

## Error Handling

Follows existing patterns with Sonner toasts:
- **Success**: "Link moved successfully!"
- **Error**: "Failed to move link" + error details
- **Delete Success**: "Link deleted successfully!"

## Performance Optimizations

1. **Accordion Collapse**: Reduces DOM complexity during drag
2. **Optimistic Updates**: Immediate UI feedback
3. **Query Invalidation**: Efficient cache updates
4. **Sensor Constraints**: Prevents accidental drags

## File Structure

```
src/
├── components/
│   ├── DraggableLink.tsx           # Individual draggable links
│   ├── DroppableCategory.tsx       # Category drop zones  
│   ├── DroppableSubCategory.tsx    # Subcategory drop zones
│   └── Sidebar.tsx                 # Main DnD context + logic
├── styles/
│   └── drag-drop.css              # Custom animations
└── index.css                      # Imports drag-drop.css
```

## Dependencies

```json
{
  "@dnd-kit/core": "Latest",
  "@dnd-kit/sortable": "Latest", 
  "@dnd-kit/utilities": "Latest",
  "framer-motion": "Latest"
}
```

## Usage Example

```tsx
// Basic drag and drop is handled automatically
// Just ensure your sidebar receives categories with proper structure:

const categories = [
  {
    id: "cat-1",
    name: "Work",
    subCategories: [
      {
        id: "sub-1", 
        name: "Projects",
        links: [
          { id: "link-1", title: "GitHub", url: "...", tags: [...] }
        ]
      }
    ]
  }
]

<Sidebar 
  categories={categories}
  session={session}
  // ... other props
/>
```

## Future Enhancements

- [ ] Batch link operations
- [ ] Drag between multiple windows/tabs
- [ ] Custom drop animations per category
- [ ] Keyboard shortcuts for power users
- [ ] Undo/redo functionality

## Troubleshooting

### Links not draggable
- Check that `session` is available
- Verify link IDs are unique
- Ensure drag handle is clicked (not link content)

### Drop zones not working  
- Verify category/subcategory IDs are correct
- Check database permissions (RLS policies)
- Ensure droppable areas are properly registered

### Accordion not collapsing
- Check `isDragging` state propagation
- Verify `setOpenCategories([])` is called on drag start

## Contributing

When modifying drag/drop behavior:
1. Test on both desktop and mobile
2. Verify accessibility with keyboard navigation  
3. Ensure error states are handled gracefully
4. Follow existing animation patterns
5. Update this documentation
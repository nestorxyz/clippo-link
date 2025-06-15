import { Category, Tag } from '@/lib/types';
import { ChevronRight, Folder, Link2, Star, User, Briefcase, PanelLeftClose, PanelLeftOpen, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link as RouterLink } from 'react-router-dom';
import { Session } from '@retired-provider/retired-provider-js';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';

interface SidebarProps {
  categories: Category[];
  isCollapsed: boolean;
  toggleSidebar: () => void;
  session: Session | null;
  isMobile?: boolean;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  lukAI: Star,
  joshi: User,
  Work: Briefcase,
  default: Folder,
};

const CategoryIcon = ({ name }: { name: string }) => {
  const Icon = categoryIcons[name] || categoryIcons.default;
  return <Icon className="h-4 w-4" />;
};

const Sidebar = ({ categories, isCollapsed, toggleSidebar, session, isMobile = false }: SidebarProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>(categories.map(c => c.id));

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]);
  };

  return (
    <div className={cn("h-full w-full")}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && <h2 className="text-lg font-semibold tracking-tight">Link Organizer</h2>}
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {categories.map(category => (
            <Collapsible key={category.id} open={openCategories.includes(category.id)} onOpenChange={() => toggleCategory(category.id)}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={category.name} />
                    {!isCollapsed && <span className="font-medium">{category.name}</span>}
                  </div>
                  {!isCollapsed && <ChevronRight className={cn("h-4 w-4 transition-transform", openCategories.includes(category.id) && "rotate-90")} />}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1 py-1">
                {category.subCategories.map(sub => (
                  <div key={sub.id}>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {!isCollapsed && <span>{sub.name}</span>}
                    </div>
                    {!isCollapsed && sub.links.map(link => (
                      <div key={link.id} className="ml-6 pr-2 py-1.5 rounded-md hover:bg-secondary/50 group">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground/80 group-hover:text-foreground">
                          <Link2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{link.description}</span>
                        </a>
                        {link.tags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {link.tags.map((tag: Tag) => (
                              <Badge
                                key={tag.id}
                                variant={tag.color ? "default" : "secondary"}
                                className="text-xs font-normal"
                                style={tag.color ? {
                                    backgroundColor: tag.color,
                                    color: getContrastColor(tag.color),
                                    borderColor: 'transparent',
                                } : {}}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <div className="p-2">
          <RouterLink to={session ? "/account" : "/auth"}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="h-4 w-4" />
              {!isCollapsed && (session ? 'Account' : 'Login')}
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

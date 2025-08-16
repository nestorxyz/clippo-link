import { MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActiveView = 'links' | 'chat';

interface BottomNavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const BottomNavbar = ({ activeView, setActiveView }: BottomNavbarProps) => {
  const navItems = [
    { view: 'links' as ActiveView, icon: LinkIcon, label: 'Links' },
    { view: 'chat' as ActiveView, icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-20 md:hidden">
      <div className="flex justify-around items-center h-16 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            className={cn(
              'flex flex-col h-full w-full rounded-none items-center justify-center gap-1',
              activeView === item.view
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
            onClick={() => setActiveView(item.view)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;

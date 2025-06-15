
import { MessageSquare, Columns, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActiveView = 'columns' | 'chat' | 'settings';

interface BottomNavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const BottomNavbar = ({ activeView, setActiveView }: BottomNavbarProps) => {
  const navItems = [
    { view: 'columns' as ActiveView, icon: Columns, label: 'Columns' },
    { view: 'chat' as ActiveView, icon: MessageSquare, label: 'Chat' },
    { view: 'settings' as ActiveView, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-10 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            className={cn(
              "flex flex-col h-full w-full rounded-none items-center justify-center gap-1",
              activeView === item.view ? 'text-primary' : 'text-muted-foreground'
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

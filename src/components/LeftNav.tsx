import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Session } from '@retired-provider/retired-provider-js';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Settings } from 'lucide-react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface LeftNavProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSubCategory: (
    subCategoryId: string | null,
    categoryId: string | null
  ) => void;
  session: Session | null;
}

const LeftNav: React.FC<LeftNavProps> = ({
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  onSelectSubCategory,
  session,
}) => {
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);
  useEffect(() => {
    if (lastCreatedId) {
      const created = categories.find((c) => c.id === lastCreatedId);
      const rest = categories.filter((c) => c.id !== lastCreatedId);
      setLocalCategories(created ? [created, ...rest] : categories);
    } else {
      setLocalCategories(categories);
    }
  }, [categories, lastCreatedId]);

  const email = session?.user?.email ?? '';
  const userMetadata = (session?.user?.user_metadata ?? {}) as {
    avatar_url?: string;
    picture?: string;
  };
  const avatarUrl = userMetadata.avatar_url || userMetadata.picture || null;
  const avatarFallback = useMemo(
    () => (email ? email.charAt(0).toUpperCase() : 'U'),
    [email]
  );

  const handleSignOut = async () => {
    try {
      await retired-provider.auth.signOut();
      // In Next.js App Router, a hard refresh ensures UI state resets
      window.location.href = '/auth';
    } catch (e) {
      console.error('Failed to sign out', e);
    }
  };
  return (
    <aside className="h-screen w-[252px] flex-shrink-0 bg-background">
      <div className="flex flex-col h-full">
        <div className="px-4 h-12 shrink-0 flex items-center">
          <h2 className="text-sm font-medium tracking-tight">DoryAI</h2>
        </div>

        <div className="px-2 pb-2">
          <AddCategoryButton
            session={session}
            onCreated={(newId) => setLastCreatedId(newId)}
          />
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {localCategories.map((category) => (
            <div key={category.id} className="mb-2">
              <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-[#646363]">
                {category.name}
              </div>
              <div className="space-y-1 px-1">
                {category.subCategories.map((sub) => {
                  const isSelected = selectedSubCategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectCategory(category.id);
                        onSelectSubCategory(sub.id, category.id);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-[#A5A5A5] text-sm rounded-md flex items-center justify-between',
                        'hover:bg-[#1D1D1D] hover:text-white',
                        isSelected && 'bg-[#1D1D1D] text-white'
                      )}
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="ml-2 text-xs text-[#A5A5A5]">
                        {sub.links.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom account/actions menu */}
        <div className="p-3 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full rounded-lg hover:bg-[#1D1D1D] p-3 flex items-center gap-3 transition-colors">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="avatar" />
                  ) : (
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 text-left">
                  <div className="text-sm text-white truncate">
                    {email || 'Account'}
                  </div>
                  <div className="text-xs text-[#A5A5A5]">Free</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-64 rounded-xl border border-[#2A2A2A] bg-[#1D1D1D] text-[#E5E5E5] p-1"
            >
              <div className="px-2 py-2 text-sm text-[#A5A5A5] truncate">
                {email}
              </div>
              <DropdownMenuSeparator className="bg-[#2A2A2A]" />
              <DropdownMenuItem
                asChild
                className="cursor-pointer focus:bg-[#2A2A2A]"
              >
                <Link
                  href="/account"
                  className="flex items-center gap-2 w-full"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer focus:bg-[#2A2A2A]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

const AddCategoryButton = ({
  session,
  onCreated,
}: {
  session: Session | null;
  onCreated: (newId: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !name.trim()) return;
    setSubmitting(true);
    try {
      const { data, error } = await retired-provider
        .from('categories')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: session.user.id,
        })
        .select('id')
        .single();
      if (error) throw error;
      if (data?.id) {
        onCreated(data.id);
        toast.success('Category created');
        setOpen(false);
        setName('');
        setDescription('');
      }
    } catch (err: unknown) {
      toast.error('Failed to create category', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-[#A5A5A5] hover:text-white hover:bg-[#1D1D1D] rounded-md px-2 py-1.5 w-full">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl border border-[#2A2A2A] bg-[#1D1D1D] text-[#E5E5E5]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription className="text-[#A5A5A5]">
            Create a new category for organizing your links.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work"
              className="bg-[#111111] border-[#2A2A2A] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description (optional)</Label>
            <Input
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="bg-[#111111] border-[#2A2A2A] text-white"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!session || !name.trim() || submitting}
              className="ml-auto"
            >
              {submitting ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeftNav;

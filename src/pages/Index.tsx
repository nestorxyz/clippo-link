
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import { initialCategories } from '@/lib/mockData';
import { Category } from '@/lib/types';
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';

const Index = ({ session }: { session: Session | null }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addLink = (categoryName: string, subCategoryName: string, url: string, description: string): boolean => {
    let found = false;
    const normalizedCategoryName = categoryName?.trim().toLowerCase();
    const normalizedSubCategoryName = subCategoryName?.trim().toLowerCase();
    
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.name.toLowerCase() === normalizedCategoryName) {
          const updatedSubCategories = category.subCategories.map(subCategory => {
            if (subCategory.name.toLowerCase() === normalizedSubCategoryName) {
              found = true;
              return {
                ...subCategory,
                links: [...subCategory.links, { id: crypto.randomUUID(), url, description, createdAt: new Date().toISOString() }]
              };
            }
            return subCategory;
          });
          if(found) return { ...category, subCategories: updatedSubCategories };
        }
        return category;
      });
    });
    return found;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <Sidebar categories={categories} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} session={session} />
      <main className="flex-1 flex flex-col h-screen">
        <Chat addLink={addLink} categories={categories} />
      </main>
    </div>
  );
};

export default Index;

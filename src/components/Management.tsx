
import { Session } from '@retired-provider/retired-provider-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryManager from './management/CategoryManager';
import SubCategoryManager from './management/SubCategoryManager';
import TagManager from './management/TagManager';

const Management = ({ session }: { session: Session | null }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Management</h1>
        <p className="text-muted-foreground">Manage your categories, sub-categories, and tags.</p>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="mt-4">
            <CategoryManager session={session} />
          </TabsContent>
          <TabsContent value="sub-categories" className="mt-4">
            <SubCategoryManager session={session} />
          </TabsContent>
          <TabsContent value="tags" className="mt-4">
            <TagManager session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Management;

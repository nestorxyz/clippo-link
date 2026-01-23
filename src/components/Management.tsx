import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryManager from './management/CategoryManager';
import SubCategoryManager from './management/SubCategoryManager';
import TagManager from './management/TagManager';
const Management = () => {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b py-[8px]">
        <h1 className="font-normal text-base">Management</h1>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="mt-4">
            <CategoryManager />
          </TabsContent>
          <TabsContent value="sub-categories" className="mt-4">
            <SubCategoryManager />
          </TabsContent>
          <TabsContent value="tags" className="mt-4">
            <TagManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Management;

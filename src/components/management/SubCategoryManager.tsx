import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Session } from '@retired-provider/retired-provider-js';
import { useCategories } from '@/hooks/useCategories';
import { retired-provider } from '@/integrations/retired-provider/client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, 'Sub-category name is required.'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Please select a category.'),
});

const SubCategoryManager = ({ session }: { session: Session | null }) => {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '', category_id: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) return;
    try {
      const { error } = await retired-provider.from('sub_categories').insert({
        name: values.name,
        description: values.description,
        category_id: values.category_id,
        user_id: session.user.id,
      });

      if (error) throw error;
      toast.success('Sub-category created successfully!');
      form.reset();
    } catch (error: unknown) {
      toast.error('Failed to create sub-category', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const allSubCategories = categories.flatMap((cat) => cat.subCategories);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Sub-Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Project A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Briefly describe the sub-category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isLoadingCategories}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Sub-Category
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Existing Sub-Categories</h3>
          <ScrollArea className="h-64 border rounded-md">
            <div className="p-4">
              {isLoadingCategories ? (
                <p>Loading...</p>
              ) : allSubCategories.length === 0 ? (
                <p>No sub-categories found.</p>
              ) : (
                <ul className="space-y-4">
                  {categories.map(
                    (cat) =>
                      cat.subCategories.length > 0 && (
                        <li key={cat.id}>
                          <h4 className="font-semibold text-sm">{cat.name}</h4>
                          <ul className="pl-4 mt-1 space-y-1">
                            {cat.subCategories.map((sub) => (
                              <li
                                key={sub.id}
                                className="p-2 bg-secondary rounded-md text-sm"
                              >
                                {sub.name}
                              </li>
                            ))}
                          </ul>
                        </li>
                      )
                  )}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubCategoryManager;

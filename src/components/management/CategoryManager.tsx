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
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
  description: z.string().optional(),
});

const CategoryManager = ({ session }: { session: Session | null }) => {
  const { data: categories = [], isLoading } = useCategories(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) return;
    try {
      const { error } = await retired-provider.from('categories').insert({
        name: values.name,
        description: values.description,
        user_id: session.user.id,
      });

      if (error) throw error;
      toast.success('Category created successfully!');
      form.reset();
    } catch (error: unknown) {
      toast.error('Failed to create category', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        Manage Categories
      </h3>
      <div className="space-y-4 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Work" {...field} />
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
                      placeholder="Briefly describe the category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Category
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Existing Categories</h3>
          <ScrollArea className="h-64 border rounded-md">
            <div className="p-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : categories.length === 0 ? (
                <p>No categories found.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id} className="p-2 bg-secondary rounded-md">
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;

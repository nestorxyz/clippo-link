import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTags } from '@/hooks/useTags';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';
import { useConvexMutation } from '@/hooks/use-convex-mutation';
import { api } from '../../../convex/_generated/api';

const formSchema = z.object({
  name: z.string().min(1, 'Tag name is required.'),
  color: z.string().optional(),
});

const TagManager = () => {
  const { data: tags = [], isLoading } = useTags();
  const { mutate: createTag, isLoading: isCreating } = useConvexMutation(
    api.tags.create
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', color: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createTag(
        {
          name: values.name,
          color: values.color || '#000000',
        },
        {
          successMessage: 'Tag created successfully!',
          errorMessage: 'Failed to create tag',
        }
      );
      form.reset();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. important" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (optional, random if not set)</FormLabel>
                  <FormControl>
                    <Input
                      type="color"
                      {...field}
                      value={field.value || '#000000'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Tag
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Existing Tags</h3>
          <ScrollArea className="h-64 border rounded-md">
            <div className="p-4">
              {isLoading ? (
                <p>Loading...</p>
              ) : tags.length === 0 ? (
                <p>No tags found.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{
                        backgroundColor: tag.color || undefined,
                        color: tag.color
                          ? getContrastColor(tag.color)
                          : undefined,
                        borderColor: 'transparent',
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagManager;

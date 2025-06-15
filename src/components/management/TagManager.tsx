
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Session } from '@retired-provider/retired-provider-js';
import { useTags } from '@/hooks/useTags';
import { retired-provider } from '@/integrations/retired-provider/client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/lib/colorUtils';

const formSchema = z.object({
  name: z.string().min(1, 'Tag name is required.'),
  color: z.string().optional(),
});

const TagManager = ({ session }: { session: Session | null }) => {
  const { data: tags = [], isLoading } = useTags(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', color: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) return;
    try {
      const insertData: { name: string; user_id: string; color?: string } = {
        name: values.name,
        user_id: session.user.id,
      };
      if (values.color) {
        insertData.color = values.color;
      }
      const { error } = await retired-provider
        .from('tags')
        .insert(insertData);

      if (error) throw error;
      toast.success('Tag created successfully!');
      form.reset();
    } catch (error: any) {
      toast.error('Failed to create tag', { description: error.message });
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
                  <FormControl><Input placeholder="e.g. important" {...field} /></FormControl>
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
                  <FormControl><Input type="color" {...field} value={field.value || '#000000'} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      style={{
                        backgroundColor: tag.color || undefined,
                        color: tag.color ? getContrastColor(tag.color) : undefined,
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

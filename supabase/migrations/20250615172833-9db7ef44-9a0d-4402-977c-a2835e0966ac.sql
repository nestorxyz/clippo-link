
-- Enable RLS and add policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert new categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS and add policies for sub_categories
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sub_categories" ON public.sub_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert new sub_categories" ON public.sub_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sub_categories" ON public.sub_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sub_categories" ON public.sub_categories FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS and add policies for links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own links" ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert new links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.links FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS and add policies for tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tags" ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert new tags" ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tags" ON public.tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tags" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS and add policies for link_tags
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage link_tags for their own links" ON public.link_tags
  FOR ALL
  USING (auth.uid() = (SELECT user_id FROM links WHERE id = link_id))
  WITH CHECK (auth.uid() = (SELECT user_id FROM links WHERE id = link_id));

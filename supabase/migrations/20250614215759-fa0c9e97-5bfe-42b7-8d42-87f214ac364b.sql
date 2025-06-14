
-- Add user_id to sub_categories for simpler, more secure data access rules
ALTER TABLE public.sub_categories ADD COLUMN IF NOT EXISTS user_id UUID;

-- Backfill the new user_id column for any existing sub_categories
UPDATE public.sub_categories sc
SET user_id = (SELECT c.user_id FROM public.categories c WHERE c.id = sc.category_id)
WHERE sc.user_id IS NULL;

-- Now that it's backfilled, make the user_id column mandatory
DO $$
BEGIN
    IF EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'sub_categories'
          AND column_name = 'user_id'
          AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.sub_categories ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Drop old policies from initial migrations to avoid conflicts
DROP POLICY IF EXISTS "Users can manage sub_categories of their own categories" ON public.sub_categories;
DROP POLICY IF EXISTS "Users can manage tags on their own links" ON public.link_tags;

-- Recreate all policies to be idempotent and consistent
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can manage their own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own chat messages" ON public.chat_messages;
CREATE POLICY "Users can manage their own chat messages" ON public.chat_messages FOR ALL
  USING ( (SELECT cs.user_id FROM public.chat_sessions cs WHERE cs.id = session_id) = auth.uid() )
  WITH CHECK ( (SELECT cs.user_id FROM public.chat_sessions cs WHERE cs.id = session_id) = auth.uid() );

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own categories" ON public.categories;
CREATE POLICY "Users can manage their own categories" ON public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own sub_categories" ON public.sub_categories;
CREATE POLICY "Users can manage their own sub_categories" ON public.sub_categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own links" ON public.links;
CREATE POLICY "Users can manage their own links" ON public.links FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own tags" ON public.tags;
CREATE POLICY "Users can manage their own tags" ON public.tags FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own link_tags" ON public.link_tags;
CREATE POLICY "Users can manage their own link_tags" ON public.link_tags FOR ALL
  USING ( (SELECT l.user_id FROM public.links l WHERE l.id = link_id) = auth.uid() )
  WITH CHECK ( (SELECT l.user_id FROM public.links l WHERE l.id = link_id) = auth.uid() );


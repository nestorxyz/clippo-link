
-- Enable real-time updates for relevant tables
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.sub_categories REPLICA IDENTITY FULL;
ALTER TABLE public.tags REPLICA IDENTITY FULL;
ALTER TABLE public.links REPLICA IDENTITY FULL;
ALTER TABLE public.link_tags REPLICA IDENTITY FULL;

-- Add tables to the real-time publication if they are not already present
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Table "categories" is already in the publication "supabase_realtime".';
END;
$$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sub_categories;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Table "sub_categories" is already in the publication "supabase_realtime".';
END;
$$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tags;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Table "tags" is already in the publication "supabase_realtime".';
END;
$$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.links;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Table "links" is already in the publication "supabase_realtime".';
END;
$$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.link_tags;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Table "link_tags" is already in the publication "supabase_realtime".';
END;
$$;

-- Create a function to generate a random hex color
CREATE OR REPLACE FUNCTION public.random_hex_color()
RETURNS TEXT AS $$
BEGIN
  RETURN '#' || lpad(to_hex(floor(random() * 16777215)::int), 6, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Update existing tags that have no color
UPDATE public.tags SET color = public.random_hex_color() WHERE color IS NULL;

-- Make the color column required and set a random default
ALTER TABLE public.tags ALTER COLUMN color SET NOT NULL;
ALTER TABLE public.tags ALTER COLUMN color SET DEFAULT public.random_hex_color();

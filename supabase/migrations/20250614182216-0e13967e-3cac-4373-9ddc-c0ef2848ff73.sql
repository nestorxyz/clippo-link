
-- Create a function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add 'updated_at' column to 'categories' and set up the trigger
ALTER TABLE public.categories
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add 'updated_at' column to 'sub_categories' and set up the trigger
ALTER TABLE public.sub_categories
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER set_sub_categories_updated_at
BEFORE UPDATE ON public.sub_categories
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add 'updated_at' column to 'links' and set up the trigger
ALTER TABLE public.links
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER set_links_updated_at
BEFORE UPDATE ON public.links
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add 'updated_at' column to 'tags' and set up the trigger
ALTER TABLE public.tags
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER set_tags_updated_at
BEFORE UPDATE ON public.tags
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Add 'color' column to 'tags'
ALTER TABLE public.tags
ADD COLUMN color TEXT;

-- Add 'created_at' column to 'link_tags'
ALTER TABLE public.link_tags
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();


-- To avoid errors on existing rows, we'll set any null titles to the link's URL.
UPDATE public.links
SET title = url
WHERE title IS NULL OR title = '';

-- Now, we can alter the column to be required.
ALTER TABLE public.links
ALTER COLUMN title SET NOT NULL;

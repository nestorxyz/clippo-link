
-- To improve query performance, I'll add indexes to columns that are frequently used in queries.

-- This index will speed up fetching categories for a specific user and finding categories by name.
CREATE INDEX idx_categories_user_id_name ON public.categories (user_id, name);

-- This index will speed up fetching sub-categories for a given category and finding them by name.
CREATE INDEX idx_sub_categories_category_id_name ON public.sub_categories (category_id, name);

-- This index will speed up fetching links within a sub-category.
CREATE INDEX idx_links_sub_category_id ON public.links (sub_category_id);

-- This index is for the Row Level Security policy on the links table, to quickly filter by user.
CREATE INDEX idx_links_user_id ON public.links (user_id);

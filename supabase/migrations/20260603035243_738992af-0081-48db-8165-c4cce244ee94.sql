CREATE TABLE public.search_usage (
  ip_hash TEXT PRIMARY KEY,
  search_count INTEGER NOT NULL DEFAULT 0,
  total_tokens BIGINT NOT NULL DEFAULT 0,
  first_search TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_search TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.search_usage TO service_role;

ALTER TABLE public.search_usage ENABLE ROW LEVEL SECURITY;
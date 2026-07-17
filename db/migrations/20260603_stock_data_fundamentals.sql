-- Add a JSON column to cache the expanded Yahoo fundamentals (earnings history,
-- forward estimates, revenue trend, analyst rating distribution, insider activity)
-- alongside the existing `financials` snapshot. Nullable: rows cached before this
-- migration keep NULL until they next refresh past the TTL, and the analysis
-- context builder treats a missing value as "no data".
ALTER TABLE public.stock_data
    ADD COLUMN IF NOT EXISTS fundamentals jsonb;

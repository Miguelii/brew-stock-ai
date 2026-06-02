-- Backfill: move existing `error` values into `metadata.error` before dropping
-- the column. Merges into the existing metadata object (or an empty object when
-- metadata is null), preserving any other metadata fields already present.
UPDATE public.logs
SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('error', error)
WHERE error IS NOT NULL;

-- Drop the now-redundant column.
ALTER TABLE public.logs DROP COLUMN IF EXISTS error;

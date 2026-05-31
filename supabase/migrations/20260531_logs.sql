CREATE TABLE IF NOT EXISTS public.logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('log', 'info', 'warn', 'error')),
    prefix TEXT,
    context TEXT,
    message TEXT,
    error JSONB,
    metadata JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS logs_created_at_idx ON public.logs (created_at DESC);
CREATE INDEX IF NOT EXISTS logs_level_idx ON public.logs (level);
CREATE INDEX IF NOT EXISTS logs_prefix_idx ON public.logs (prefix);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_logs"
    ON public.logs FOR SELECT
    USING (public.is_admin());

GRANT INSERT ON public.logs TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.logs_id_seq TO service_role;

CREATE OR REPLACE FUNCTION public.prune_logs(p_days INTEGER DEFAULT 90)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_deleted BIGINT;
BEGIN
    DELETE FROM public.logs
    WHERE created_at < NOW() - (p_days || ' days')::INTERVAL;
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_logs(INTEGER) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_logs(INTEGER) TO service_role;

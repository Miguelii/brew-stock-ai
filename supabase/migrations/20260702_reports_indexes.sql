-- Indexes for the reports list queries: user lists filter by user_id and order by
-- created_at, admin lists order by created_at globally and filter by status.
CREATE INDEX IF NOT EXISTS reports_user_id_created_at_idx
    ON public.reports (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS reports_created_at_idx
    ON public.reports (created_at DESC);

CREATE INDEX IF NOT EXISTS reports_status_idx
    ON public.reports (status);

-- Idempotency ledger for Stripe webhook deliveries: the handler claims an event id
-- before crediting, so retried deliveries of the same event never credit twice.
CREATE TABLE IF NOT EXISTS public.stripe_processed_events (
    event_id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No policies on purpose: only the service-role client (webhook handler) may touch this table.
ALTER TABLE public.stripe_processed_events ENABLE ROW LEVEL SECURITY;

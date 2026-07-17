-- Table to track user token balances
CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Users can only read their own credits
CREATE POLICY "users_read_own_credits"
    ON public.user_credits
    FOR SELECT
    USING (auth.uid() = user_id);

-- Function: atomically deduct p_amount credits, returns new balance or NULL if insufficient
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_credits INTEGER;
BEGIN
    UPDATE public.user_credits
    SET credits = credits - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND credits >= p_amount
    RETURNING credits INTO v_new_credits;

    RETURN v_new_credits; -- NULL if no row updated (insufficient credits)
END;
$$;

-- Function: add credits (called from webhook via service role)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_credits INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_credits INTEGER;
BEGIN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (p_user_id, p_credits)
    ON CONFLICT (user_id)
    DO UPDATE SET
        credits = user_credits.credits + EXCLUDED.credits,
        updated_at = NOW()
    RETURNING credits INTO v_new_credits;

    RETURN v_new_credits;
END;
$$;

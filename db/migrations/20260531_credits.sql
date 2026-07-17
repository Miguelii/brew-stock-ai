CREATE POLICY "users_update_own_stripe_customer_id"
    ON public.user_credits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
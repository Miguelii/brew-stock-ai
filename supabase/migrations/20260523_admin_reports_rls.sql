-- Helper: returns true if the current JWT belongs to a super-admin user.
-- Created in public (not auth) because Supabase restricts creating functions
-- in the auth schema. SECURITY DEFINER makes it run as the postgres role,
-- which has access to auth.users. STABLE ensures it is evaluated once per
-- statement rather than once per row.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT is_super_admin FROM auth.users WHERE id = auth.uid()),
        false
    )
$$;

-- New SELECT policy: users see their own reports; super admins see all.
CREATE POLICY "Enable users to view their own data only"
    ON public.reports
    FOR SELECT
    USING (
        (SELECT auth.uid()) = user_id
        OR public.is_admin()
    );

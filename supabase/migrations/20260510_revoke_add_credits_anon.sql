REVOKE EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.deduct_credit(UUID, INTEGER) FROM anon;

GRANT EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER) TO supabase_admin;
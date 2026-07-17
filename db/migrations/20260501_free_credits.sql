-- Function that creates the initial credits when a user is created
create or replace function public.handle_new_user_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_credits (user_id, credits)
  values (new.id, 2)
  on conflict (user_id) do nothing;

  if found then
    raise warning 'handle_new_user_credits: inserted 2 credits for user_id=%', new.id;
  else
    raise warning 'handle_new_user_credits: conflict for user_id=%, no credits inserted', new.id;
  end if;

  return new;
end;
$$;

-- Trigger that calls the function after an INSERT into auth.users
create or replace trigger on_auth_user_created_credits
  after insert on auth.users
  for each row
  execute function public.handle_new_user_credits();
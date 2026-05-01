-- Função que cria os créditos iniciais quando um user é criado
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
  return new;
end;
$$;

-- Trigger que chama a função após INSERT em auth.users
create or replace trigger on_auth_user_created_credits
  after insert on auth.users
  for each row
  execute function public.handle_new_user_credits();
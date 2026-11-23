create or replace function public.admin_promote_customer_to_walker(p_profile_id uuid)
returns uuid language plpgsql security definer set search_path=''
as $$
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 if not exists(select 1 from public.profiles where id=p_profile_id and role='customer') then raise exception 'Only an existing customer profile can be moved into Walker recruitment review'; end if;
 if exists(select 1 from public.subscriptions where customer_id=p_profile_id and status='active') then raise exception 'This account has an active customer subscription. Use a separate account for Walker recruitment.'; end if;
 insert into public.walkers(id,verification_status,is_active) values(p_profile_id,'pending',false)
 on conflict(id) do update set verification_status='pending',is_active=false,review_note=null
 where public.walkers.verification_status in ('rejected','suspended');
 update public.profiles set role='walker' where id=p_profile_id and role='customer';
 return p_profile_id;
end $$;
revoke all on function public.admin_promote_customer_to_walker(uuid) from public,anon;
grant execute on function public.admin_promote_customer_to_walker(uuid) to authenticated;
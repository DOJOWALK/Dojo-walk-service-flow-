create or replace function public.admin_suspend_walker(p_walker_id uuid,p_note text)
returns void language plpgsql security definer set search_path=''
as $$
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 if length(btrim(coalesce(p_note,'')))<5 or length(p_note)>2000 then raise exception 'Suspension reason must be 5–2000 characters'; end if;
 if exists(select 1 from public.bookings where walker_id=p_walker_id and
   (status in ('arrived','in_progress','end_pending') or (status in ('assigned','accepted') and scheduled_at>now()))) then
  raise exception 'Reassign future duties and close any active walk before suspending this Walker';
 end if;
 update public.walkers set verification_status='suspended',is_active=false,review_note=btrim(p_note)
 where id=p_walker_id and verification_status='approved';
 if not found then raise exception 'Approved Walker not found'; end if;
 update public.profiles set role='customer' where id=p_walker_id and role='walker';
end $$;
revoke all on function public.admin_suspend_walker(uuid,text) from public,anon;
grant execute on function public.admin_suspend_walker(uuid,text) to authenticated;
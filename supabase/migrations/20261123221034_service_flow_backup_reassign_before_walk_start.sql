create or replace function public.admin_assign_backup_booking(p_booking_id uuid,p_backup_walker_id uuid,p_reason text)
returns void language plpgsql security definer set search_path=''
as $$
declare v_primary uuid; v_subscription uuid; v_dog uuid; v_scheduled timestamptz; v_duration smallint; v_count integer;
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 if length(btrim(coalesce(p_reason,'')))<5 or length(p_reason)>1000 then raise exception 'Backup reason is required'; end if;
 select walker_id,subscription_id,dog_id,scheduled_at,duration_minutes into v_primary,v_subscription,v_dog,v_scheduled,v_duration
 from public.bookings where id=p_booking_id and status in ('assigned','accepted') and scheduled_at>now() for update;
 if not found or v_subscription is null then raise exception 'Only future unstarted subscription bookings can use backup assignment'; end if;
 if not exists(select 1 from public.subscriptions where id=v_subscription and primary_walker_id=v_primary) then raise exception 'Current assigned Walker is not the subscription primary'; end if;
 if not exists(select 1 from public.walker_leave_requests where walker_id=v_primary and status='approved' and v_scheduled::date between start_date and end_date) then raise exception 'Backup assignment requires approved primary Walker leave'; end if;
 if not exists(select 1 from public.walkers w join public.profiles p on p.id=w.id where w.id=p_backup_walker_id and p.role='walker' and w.is_active and w.verification_status='approved') then raise exception 'Backup Walker must be approved and active'; end if;
 if exists(select 1 from public.walker_leave_requests where walker_id=p_backup_walker_id and status='approved' and v_scheduled::date between start_date and end_date) then raise exception 'Backup Walker is on approved leave'; end if;
 if exists(select 1 from public.bookings b where b.walker_id=p_backup_walker_id and b.status in ('assigned','accepted','arrived','in_progress','end_pending') and b.scheduled_at<v_scheduled+make_interval(mins=>v_duration+30) and b.scheduled_at+make_interval(mins=>b.duration_minutes+30)>v_scheduled) then raise exception 'Backup Walker has a conflicting walk or travel buffer'; end if;
 select count(distinct b.dog_id) into v_count from public.bookings b where b.walker_id=p_backup_walker_id and b.status in ('assigned','accepted','arrived','in_progress','end_pending') and b.scheduled_at>=now()-interval '1 day';
 if v_count>=10 and not exists(select 1 from public.bookings b where b.walker_id=p_backup_walker_id and b.dog_id=v_dog and b.status in ('assigned','accepted','arrived','in_progress','end_pending')) then raise exception 'Backup Walker capacity of 10 dogs reached'; end if;
 update public.bookings set walker_id=p_backup_walker_id,status='assigned',updated_at=now() where id=p_booking_id;
 insert into public.walk_events(booking_id,actor_id,event_type,note) values(p_booking_id,auth.uid(),'backup_assigned','Approved leave backup; primary='||v_primary::text||'; reason='||btrim(p_reason));
end $$;
revoke all on function public.admin_assign_backup_booking(uuid,uuid,text) from public,anon;
grant execute on function public.admin_assign_backup_booking(uuid,uuid,text) to authenticated;
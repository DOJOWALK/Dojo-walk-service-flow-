create or replace function public.admin_generate_subscription_bookings(p_days integer default 14)
returns integer language plpgsql security definer set search_path=''
as $$
declare v_today date:=(now() at time zone 'Asia/Kolkata')::date; v_date date; r record; v_slot text; v_time time; v_count integer:=0; v_id uuid;
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 if p_days<1 or p_days>30 then raise exception 'Generation window must be 1–30 days'; end if;
 for r in select sc.*,s.customer_id,s.dog_id,s.id subscription_id,p.duration_minutes,s.starts_on,s.ends_on
  from public.subscription_schedules sc join public.subscriptions s on s.id=sc.subscription_id
  join public.service_packages p on p.id=s.package_id where sc.active and s.status='active'
 loop
  for v_date in select d::date from generate_series(v_today,v_today+(p_days-1),interval '1 day') d
   where extract(isodow from d) between 1 and 6 and d::date between r.starts_on and r.ends_on
  loop
   if r.morning_time is not null then
    v_time:=r.morning_time; v_slot:='morning';
    if ((v_date+v_time) at time zone 'Asia/Kolkata')>now() then
     insert into public.bookings(customer_id,dog_id,subscription_id,scheduled_at,service_slot,duration_minutes,service_address,latitude,longitude)
     values(r.customer_id,r.dog_id,r.subscription_id,(v_date+v_time) at time zone 'Asia/Kolkata',v_slot,r.duration_minutes,r.service_address,r.latitude,r.longitude)
     on conflict do nothing returning id into v_id;
     if v_id is not null then insert into public.walk_events(booking_id,actor_id,event_type,note) values(v_id,auth.uid(),'requested','Generated from recurring schedule'); v_count:=v_count+1; v_id:=null; end if;
    end if;
   end if;
   if r.evening_time is not null then
    v_time:=r.evening_time; v_slot:='evening';
    if ((v_date+v_time) at time zone 'Asia/Kolkata')>now() then
     insert into public.bookings(customer_id,dog_id,subscription_id,scheduled_at,service_slot,duration_minutes,service_address,latitude,longitude)
     values(r.customer_id,r.dog_id,r.subscription_id,(v_date+v_time) at time zone 'Asia/Kolkata',v_slot,r.duration_minutes,r.service_address,r.latitude,r.longitude)
     on conflict do nothing returning id into v_id;
     if v_id is not null then insert into public.walk_events(booking_id,actor_id,event_type,note) values(v_id,auth.uid(),'requested','Generated from recurring schedule'); v_count:=v_count+1; v_id:=null; end if;
    end if;
   end if;
  end loop;
 end loop;
 return v_count;
end $$;
revoke all on function public.admin_generate_subscription_bookings(integer) from public,anon;
grant execute on function public.admin_generate_subscription_bookings(integer) to authenticated;
create or replace function public.admin_resolve_incident(p_incident_id uuid,p_resolution text)
returns void language plpgsql security definer set search_path=''
as $$
declare v_booking uuid;
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 if length(btrim(coalesce(p_resolution,'')))<5 or length(p_resolution)>3000 then raise exception 'Resolution must be 5–3000 characters'; end if;
 update public.incidents set status='resolved',resolution=btrim(p_resolution),resolved_at=now()
 where id=p_incident_id and status in ('open','investigating') returning booking_id into v_booking;
 if not found then raise exception 'Open incident not found'; end if;
 if v_booking is not null then update public.bookings set status='review',updated_at=now() where id=v_booking and status='incident'; end if;
end $$;
revoke all on function public.admin_resolve_incident(uuid,text) from public,anon;
grant execute on function public.admin_resolve_incident(uuid,text) to authenticated;
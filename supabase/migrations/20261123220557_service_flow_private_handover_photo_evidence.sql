insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('handover-evidence','handover-evidence',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists handover_evidence_walker_upload on storage.objects;
create policy handover_evidence_walker_upload on storage.objects
for insert to authenticated
with check (bucket_id='handover-evidence' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.handover_requests h where h.id=((storage.foldername(name))[2])::uuid and h.walker_id=(select auth.uid())));

drop policy if exists handover_evidence_participant_read on storage.objects;
create policy handover_evidence_participant_read on storage.objects
for select to authenticated
using (bucket_id='handover-evidence' and exists(
 select 1 from public.handover_requests h join public.bookings b on b.id=h.booking_id
 where h.id=((storage.foldername(name))[2])::uuid
 and (h.walker_id=(select auth.uid()) or b.customer_id=(select auth.uid()) or private.is_admin())
));

create or replace function public.walker_attach_handover_evidence(p_request_id uuid,p_evidence_path text)
returns void language plpgsql security definer set search_path=''
as $$
declare v_uid uuid:=auth.uid();
begin
 if v_uid is null then raise exception 'Authentication required'; end if;
 if p_evidence_path is null or length(p_evidence_path)>500 then raise exception 'Evidence path required'; end if;
 if split_part(p_evidence_path,'/',1)<>v_uid::text or split_part(p_evidence_path,'/',2)<>p_request_id::text then raise exception 'Evidence path must be scoped to this walker and request'; end if;
 if not exists(select 1 from public.handover_requests where id=p_request_id and walker_id=v_uid and customer_decision='pending' and admin_decision='pending') then raise exception 'Pending handover request not found'; end if;
 if not exists(select 1 from storage.objects where bucket_id='handover-evidence' and name=p_evidence_path) then raise exception 'Uploaded evidence object not found'; end if;
 update public.handover_requests set evidence_path=p_evidence_path where id=p_request_id and walker_id=v_uid;
end $$;
create or replace function public.admin_review_handover(p_request_id uuid,p_approve boolean)
returns void language plpgsql security definer set search_path=''
as $$
declare v_booking uuid; v_customer text; v_evidence text;
begin
 if not private.is_admin() then raise exception 'Admin access required'; end if;
 select booking_id,customer_decision,evidence_path into v_booking,v_customer,v_evidence from public.handover_requests where id=p_request_id and admin_decision='pending' for update;
 if not found then raise exception 'Pending handover request not found'; end if;
 if p_approve and v_customer<>'yes' then raise exception 'Customer YES is mandatory before Admin approval'; end if;
 if p_approve and (v_evidence is null or not exists(select 1 from storage.objects where bucket_id='handover-evidence' and name=v_evidence)) then raise exception 'Uploaded photo evidence is mandatory before approval'; end if;
 update public.handover_requests set admin_decision=case when p_approve then 'approved' else 'rejected' end,reviewed_by=auth.uid(),reviewed_at=now() where id=p_request_id;
 insert into public.walk_events(booking_id,actor_id,event_type,note) values(v_booking,auth.uid(),'handover_admin_decision',case when p_approve then 'Admin approved after customer YES and photo evidence' else 'Admin rejected handover' end);
end $$;
revoke all on function public.walker_attach_handover_evidence(uuid,text) from public,anon;
grant execute on function public.walker_attach_handover_evidence(uuid,text) to authenticated;
revoke all on function public.admin_review_handover(uuid,boolean) from public,anon;
grant execute on function public.admin_review_handover(uuid,boolean) to authenticated;
create or replace function public.customer_decide_handover(p_request_id uuid,p_accept boolean)
returns void language plpgsql security definer set search_path=''
as $$
declare v_booking uuid; v_evidence text;
begin
 select h.booking_id,h.evidence_path into v_booking,v_evidence
 from public.handover_requests h join public.bookings b on b.id=h.booking_id
 where h.id=p_request_id and b.customer_id=auth.uid() and h.customer_decision='pending'
 for update of h;
 if not found then raise exception 'Pending handover request not found for this customer'; end if;
 if p_accept and (v_evidence is null or not exists(select 1 from storage.objects where bucket_id='handover-evidence' and name=v_evidence)) then
  raise exception 'Review the uploaded photo evidence before consenting YES';
 end if;
 update public.handover_requests set customer_decision=case when p_accept then 'yes' else 'no' end
 where id=p_request_id and customer_decision='pending';
 insert into public.walk_events(booking_id,actor_id,event_type,note)
 values(v_booking,auth.uid(),'handover_customer_decision',case when p_accept then 'Customer consented YES after photo review; Admin approval still required' else 'Customer declined handover' end);
end $$;
revoke all on function public.customer_decide_handover(uuid,boolean) from public,anon;
grant execute on function public.customer_decide_handover(uuid,boolean) to authenticated;
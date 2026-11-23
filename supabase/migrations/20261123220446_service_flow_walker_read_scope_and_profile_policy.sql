drop policy if exists dogs_read_assigned_walker on public.dogs;
create policy dogs_read_assigned_walker on public.dogs
for select to authenticated
using (exists(select 1 from public.bookings b where b.dog_id=dogs.id and b.walker_id=(select auth.uid())));

drop policy if exists subscriptions_read_owner_walker_admin on public.subscriptions;
create policy subscriptions_read_owner_walker_admin on public.subscriptions
for select to authenticated
using (
 customer_id=(select auth.uid())
 or private.is_admin()
 or exists(select 1 from public.bookings b where b.subscription_id=subscriptions.id and b.walker_id=(select auth.uid()))
);

drop policy if exists profiles_update_walker_self on public.profiles;
create policy profiles_update_walker_self on public.profiles
for update to authenticated
using (id=(select auth.uid()) and role='walker')
with check (id=(select auth.uid()) and role='walker');
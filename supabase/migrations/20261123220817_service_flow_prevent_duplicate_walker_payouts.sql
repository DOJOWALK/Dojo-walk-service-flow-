create unique index if not exists walker_payouts_one_period_per_walker
on public.walker_payouts(walker_id,period_start,period_end);

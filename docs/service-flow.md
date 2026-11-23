# DOJO WALK service flow

## Customer
OTP sign-in → customer profile → dog profile → choose Monthly (30 days) or Temporary (1–15 days) → choose Single/Double and 30/45/60 min → choose morning/evening window → service-area availability → payment placeholder → company assigns walker → schedule and notifications → live walk → report/history → feedback, complaint, leave or renewal.

## Walker
Admin application review → interview → KYC verification → training → approval/activation → company login → assigned duty → navigate → arrival verification → explicit start confirmation → tracked walk → explicit end confirmation → proof/report → completed → next duty.

## Admin
Dashboard → customer/booking management → recruitment/KYC/training → primary assignment → recurring schedule → live operations → leave/backup → pricing and payroll → support/incidents → reports/audit.

## Rules
- Managed service, not a marketplace.
- Monthly booking is 30 days only; temporary booking is 1–15 days.
- Monthly customer has one primary walker for both daily slots where feasible.
- Walker capacity max 10 assigned dogs; additionally validate travel time and schedule feasibility.
- One dog per walk.
- Morning 05:00–11:00; evening 16:00–22:00.
- Backup only after admin approval; notify customer.
- Customer Outside: walker request + GPS/reason/proof → explicit customer consent → admin approval → final handover proof and audit event.
- End walk should not require walker to return home. If location accuracy is poor, allow end submission but mark verification pending.
- Do not show walker payout to customers or customer price to walkers.

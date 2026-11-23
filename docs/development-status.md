# Development status (updated 2026-11-24)

DOJO WALK is a staging-connected product implementation, not a production-ready live service.

## Implemented on staging

- 14 public tables; all 14 have RLS enabled.
- 54 package rows: 18 approved 30-minute prices and 36 quote-only 45/60-minute combinations.
- 25 application RPCs (12 original Service Flow RPCs plus 13 operational RPCs), in addition to the Auth profile trigger.
- Customer and Walker Expo clients with persistent Supabase sessions and email OTP role gates.
- Admin Next.js OTP gate with database role check.
- Customer profile/dog profile save, package catalogue lookup, manual UPI reference submission, active subscription schedule setup and live walk history.
- Admin manual payment review/activation, recurring booking generation up to 30 days, primary-walker assignment, completed-walk verification, handover review, incident resolution and payout ledger.
- Walker assigned-duty list, accept, foreground GPS arrival snapshot, start/end/report, incident reporting, leave requests, handover photo capture and private upload, approved handover completion and private payout view.
- Outside handover requires GPS, private camera photo, customer photo review and YES, Admin approval, and a final Walker confirmation with a second GPS audit snapshot.
- Primary walker is locked on the subscription at first assignment. Backup assignment is allowed only for future bookings during approved primary-walker leave.
- Walker capacity is capped at 10 distinct dogs; a 30-minute schedule buffer prevents overlapping duties.
- Payout drafts require verified completed walks, duplicate walker-period payouts are blocked, and Admin must approve before marking paid. Pay amount is manually entered because no approved walker rate exists.

## Still required before launch

- Configure Supabase Auth email provider/SMTP and test real customer, Walker and Admin mailboxes.
- Provision the initial Admin and approved Walker profiles through trusted owner-side tooling. No self-service role promotion exists.
- Payment gateway, UPI QR/deep link, webhook verification, refunds and reconciliation. Checkout currently accepts a manual UPI transaction reference only.
- Continuous/background GPS, arrival geofence, route navigation, route-distance travel-time calculations and live Realtime map. Current arrival is a foreground GPS snapshot and assignment uses a fixed 30-minute buffer.
- Push notifications and customer notifications for assignment/leave/backup changes.
- Walker recruitment/KYC, document upload, training records and secure Walker provisioning UI.
- Automated payout-rate calculations. Payroll amount is manually entered by Admin; no rate is invented.
- Full customer/Walker/Admin RLS and RPC integration tests, automated tests, Android builds/device QA, independent security review and deployment.

## Staging database and source-control notes

The separate staging project has 14 applied migrations, 14 RLS-enabled tables and 25 application RPCs (plus the Auth profile trigger). The nine follow-up migration SQL files are mirrored in `supabase/migrations/` with their applied versions. The original five core migration SQL sources were applied before they were added to repository source control and are still missing; reconstruct those five files before expecting a clean database rebuild from the repository.

All client configuration uses the staging publishable key, never a service-role key. The existing populated Supabase project was not modified.

## Admin pages

Live staging-backed: `/payments`, `/bookings`, `/finance`, `/support`, `/leave`. The `/assignments` route forwards to live booking assignment.

Still demo/scaffold: customer CRM, Walker recruitment/KYC, reports, settings and several live-operations widgets. These do not create live records.

## Security

RLS is enabled on all 14 public tables. SECURITY DEFINER functions use fixed empty search paths and explicit role/ownership/state checks, but Supabase Security Advisor still reports authenticated SECURITY DEFINER RPC warnings. Independent security testing is required; RLS enabled alone is not proof that every access policy is correct.

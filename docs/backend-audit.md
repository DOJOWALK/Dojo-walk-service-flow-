# Backend audit and Service Flow handoff

Updated: 2026-11-24

## Project boundary

Two Supabase projects exist in the account:

- Existing populated project `wtmuvexdtjhgoljyozdx`: 21 public tables were present in the earlier audit. This project has not been modified by the Service Flow work.
- Separate staging project `pcyrqgowmztbcogamzog` (`dojo-walk-staging`, ap-southeast-1): all implementation and migrations described below were applied here.

## Current staging verification

- 14 applied migrations.
- 14 public tables; all 14 have RLS enabled.
- 54 service package rows: 18 approved 30-minute rates and 36 quote-only 45/60-minute variants.
- 25 application RPC functions plus the Auth profile trigger.
- Private `handover-evidence` Storage bucket, max 5 MB, JPEG/PNG/WebP only.
- Walker leave requests and primary/backup assignment are persisted.
- The existing populated Supabase project was not changed.

## Implemented database workflows

### Customer and booking
- Auth trigger creates customer profiles.
- Customer owns and edits profile/dog data.
- Package payment-reference submission creates a pending subscription/payment.
- Admin payment review activates or rejects the subscription.
- Customer saves recurring schedule; Single plans require one slot, Double plans require morning and evening.
- Admin generates up to 30 days of Monday–Saturday bookings.

### Assignment and walker execution
- First assignment locks the subscription's primary walker.
- Subsequent bookings must use that primary walker.
- Backup assignment is a separate Admin RPC and only allowed for future assigned bookings during approved primary-walker leave.
- Walker capacity is capped at 10 distinct dogs.
- Assignment and backup assignment enforce a 30-minute scheduling buffer; actual road distance/travel time is not calculated.
- Walker can accept, mark arrival with a foreground GPS snapshot, start, finish with report and await Admin verification.
- Walker can see dog data only when an assigned booking exists.

### Safety, leave and payout
- Outside handover requires a GPS-tagged Walker request, private camera photo upload, customer photo review and YES, Admin approval, and final Walker confirmation with another GPS snapshot.
- Admin Support uses short-lived signed URLs to review private evidence.
- Incident reporting and Admin resolution are persisted.
- Walker submits leave dates/reason; Admin approves/rejects. Approved leave can trigger backup assignment without changing the subscription primary walker.
- Payout draft requires at least one verified completed walk in the selected period. Admin manually enters the amount, approves and marks paid. Duplicate walker-period payouts are blocked. No unapproved Walker pay rate is calculated.

## Client wiring

Customer Expo app:
- Email OTP role gate, profile/dog save, live package catalogue, manual UPI reference submission, active subscription schedule, walk history, customer handover photo review and YES/NO consent.

Walker Expo app:
- Email OTP role gate, assigned duties, accept/start/finish, foreground GPS arrival, incident reporting, leave request/history, handover camera upload/final GPS confirmation, private own-payout list.

Admin Next.js console:
- Email OTP + database Admin role gate, payment verification, booking generation/assignment/walk verification, leave approval/backup assignment, handover photo review/approval, incident resolution, live package catalogue and manual payout ledger.

## Remaining launch blockers

- Supabase Auth email provider/SMTP configuration and real mailbox tests.
- Trusted provisioning of initial Admin and approved Walker accounts. No self-service role promotion exists.
- Payment gateway/UPI QR/deep link/webhook/refunds/reconciliation; current customer flow accepts manual UPI reference only.
- Continuous/background GPS, arrival geofence, route navigation, route-distance travel-time checks and live Realtime map.
- Push notifications and customer notification delivery for assignment/leave/backup changes.
- Walker KYC, document upload, training and secure provisioning UI.
- Approved Walker pay rate and automated payout calculation.
- Full role-based RLS/RPC integration tests, Android builds/device QA, independent security review and deployment.

## Security findings

RLS is enabled on all 14 staging public tables. Supabase Security Advisor reports 25 authenticated SECURITY DEFINER RPC warnings. Functions use fixed empty search paths and explicit role/ownership/state checks, but these warnings require independent review and penetration testing. Do not assume RLS enabled alone proves access control is correct.

The private Storage bucket has a Walker-scoped INSERT policy and participant/Admin SELECT policy. Device upload and signed-URL viewing have not yet been exercised with real customer/Walker/Admin sessions.

## Migration source-control caveat

The 13 migrations are applied in staging. The nine follow-up migration SQL files are mirrored in `supabase/migrations/` with their applied version numbers. The original five core migration SQL sources were applied before source files were added to the repository and remain missing. Reconstruct those first five SQL files before expecting a clean database rebuild from the repository migration directory.

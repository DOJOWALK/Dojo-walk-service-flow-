# Backend audit and Service Flow handoff

Updated: 2026-11-24

## Repository / database boundary

The repository is an application scaffold. A Supabase account currently exposes two projects:

- The populated project created as the account's default project has 21 public tables. All 21 tables currently report Row Level Security enabled.
- The project named `dojo-walk-staging` is active but has no public tables yet.

Do not assume which project is the intended production database. Before applying schema changes, indexes, policies, or seed data, the owner must confirm whether the populated project is the intended integration target or whether staging should receive a reviewed schema first. No database writes were made during this audit.

## Existing data model found in populated project

The database already has core entities for:

- Profiles, walkers, dogs and pricing
- Bookings, payments, walker locations, walk events and reviews
- Service packages, dog subscriptions, subscription payments and recurring walk schedules
- Walker commissions and payouts
- Customer credit accounts and ledger
- Pay-later requests, booking change requests and schedule change requests
- Business settings

This is a useful starting point; avoid creating duplicate tables before reviewing the existing definitions and constraints.

## Audit findings

### Security

- RLS is enabled on all 21 public tables.
- The Supabase security advisor reports 18 `SECURITY DEFINER` functions executable by the `authenticated` role. This warning is not proof of an exploitable vulnerability: several inspected RPCs perform role, ownership, or assigned-walker checks internally. However, every function must be reviewed for authorization, fixed `search_path`, and least-privilege grants before launch.
- The private `is_admin()` helper checks the authenticated user's `profiles.role = 'admin'`. Admin role assignment must remain owner-controlled; never accept a role from client-editable user metadata.
- Leaked-password protection is disabled in Supabase Auth and should be enabled in the Auth security settings before production use.

### Performance

- The performance advisor reports 20 foreign keys without covering indexes.
- Two RLS policies re-evaluate auth context per row; use scalar subqueries such as `(select auth.uid())` after reviewing each policy.
- Multiple permissive policies are reported on several tables. These are not automatically incorrect, but should be consolidated only after checking that customer, walker and Admin access remains unchanged.
- Several indexes are currently unused. Do not remove them based on a low-traffic staging or early-launch workload alone.

## Service Flow readiness

| Area | Database foundation | Remaining integration / verification |
|---|---|---|
| Customer identity and profile | Profiles table exists | OTP provider, onboarding, role-safe profile writes |
| Dog profile | Dogs table exists | Customer app CRUD, validation, storage for documents if required |
| Packages and pricing | Service packages and pricing exist | Reconcile approved rate card and quote-only durations; verify package ordering |
| Booking request | Bookings and customer RPCs exist | Connect app, idempotency, availability and payment gate |
| Admin assignment | Walker and booking tables exist | Verify permanent-primary assignment rules, max 10 dogs and backup-only exception |
| Recurring schedule | Subscription schedule tables and generator exist | Verify next-day publication, timezone, duplicate protection and schedule window |
| Walker execution | Accept/start/finish RPCs and events exist | GPS arrival, geofence review, photo upload, offline handling and Admin completion review |
| Customer updates | Walk events exist | Realtime subscriptions and push notification delivery |
| Safety / handover | Not confirmed in current table inventory | Explicit customer YES + Admin approval + immutable audit trail |
| Finance | Payments, credits, commissions and payouts exist | Payment gateway/webhook verification, refunds, payout reconciliation and monthly close |
| Support / incidents | Not confirmed as persisted entities in the inventory | Persist incident lifecycle, evidence, assignment, resolution and audit history |

## Non-negotiable business rules to enforce server-side

- DOJO WALK is a managed service. Customers do not select arbitrary walkers; Admin owns primary assignment.
- One dog per walk. One permanent primary walker per customer/dog where feasible; temporary backup only for approved leave or emergency.
- A walker may have at most 10 assigned dogs, subject to route and schedule feasibility.
- Morning service window: 05:00–11:00. Evening: 16:00–22:00. Use Asia/Kolkata consistently.
- Monthly plans are 30 days. Temporary plans are 1–15 days. Do not invent prices for unapproved day counts or durations.
- Customer payments and walker payouts are separate ledgers. Customer apps must not expose walker compensation; walker apps must not expose customer payment details.
- Only verified completed walks accrue walker payout.
- Handover requires both customer YES and Admin approval; record actor, timestamp, reason, GPS and proof.
- Leave and backup assignment require Admin approval and customer notification.

## Safe next sequence

1. Owner confirms the intended Supabase target (populated project or empty staging).
2. Export/review existing schema and RPC definitions; capture a restorable backup.
3. Review all 18 exposed `SECURITY DEFINER` RPCs and role grants. Do not blanket-revoke functions used by the mobile apps; preserve only explicitly authorized RPCs.
4. Confirm RLS policy coverage and test customer/walker/Admin access with separate test accounts.
5. Add the missing indexes in a reviewed migration after capturing the existing schema in version control.
6. Connect app clients using only the publishable key; keep secret/service-role credentials in server-side secrets.
7. Wire one vertical slice end-to-end: customer request → Admin assignment → walker accept/start/finish → Admin verification → customer report.
8. Add payment provider webhooks, push notifications, photo storage, safety workflows and monthly payout reconciliation.
9. Run automated RLS and domain tests, Android device QA, Supabase advisors and a production security review.

## Current limitation

No database schema or row was changed in this audit. No live booking, payment, GPS session, notification, handover or payout was created. The database is not yet connected to the mobile/admin clients by this audit.

## Staging implementation update (2026-11-24)

The owner selected `dojo-walk-staging` (project ref `pcyrqgowmztbcogamzog`, region `ap-southeast-1`). Four database migrations have been applied successfully:

- `dojo_walk_service_flow_core`
- `service_flow_booking_walk_rpcs`
- `service_flow_packages_and_payments`
- `service_flow_recurring_schedules`
- `service_flow_limits_and_indexes`

Verified staging inventory: 13 public tables, all 13 with RLS enabled; 12 Service Flow RPCs; 54 package rows. The package seed contains all 18 approved 30-minute rates (Single/Double × 1, 2, 3, 5, 7, 10, 14, 15, 30 days) and 36 45/60-minute Admin-quote-only options. 45/60-minute values were not invented.

Implemented backend foundation:
- Customer, dog, walker, package, subscription, recurring schedule, booking, walk event, GPS location, handover, incident, payment and payout tables.
- Customer package payment reference submission and Admin verification (manual UPI reference workflow only; no payment gateway).
- Admin-only walker assignment with approved/active walker checks and 10-dog capacity guard.
- Walker accept → GPS arrival → start → finish submission; Admin verify/review.
- Recurring booking generation window up to 14 days, with India-time morning/evening windows and package walk-count validation.
- RLS enabled across all 13 tables, role/ownership-aware read policies, and indexes for the identified foreign-key access paths.

Security note: Supabase Security Advisor currently flags the 12 authenticated RPCs as `SECURITY DEFINER`. These are intentionally callable RPC entry points and contain explicit caller/role/ownership/state checks plus an empty fixed search_path. Keep the warning visible for review; do not remove checks or broadly grant table writes to silence the lint.

## Still not production-complete

- Mobile and Admin clients are not yet wired to this staging project; no project URL or publishable key has been committed.
- No Auth OTP provider, test customer/walker/admin accounts, Storage bucket policies, Realtime subscriptions, push notifications, payment gateway/webhook, or Edge Functions configured.
- Handover and incident tables exist, but their complete consent/approval RPCs and evidence upload flow are still pending.
- Payroll tables exist, but completed-walk payout calculation, approval and monthly settlement logic are pending.
- No end-to-end user-session test has been run. Database migrations and schema counts were verified; app build/device tests were not run.
- First Admin role must be assigned by the project owner through a trusted server-side/admin process, never from client metadata.


## Staging follow-up migrations (2026-11-24)

The staging project `pcyrqgowmztbcogamzog` now has nine applied migrations total. The original five Service Flow migrations remain as previously recorded above; four follow-up migrations add:

- `service_flow_handover_incidents_payroll`: walker handover request, customer YES/NO, Admin review, incident reporting/resolution, and manually entered payout draft/approval/paid RPCs.
- `service_flow_30_day_generation_and_incident_resolution`: expands recurring booking generation from 14 to 30 days and moves an incident booking into Admin review after incident resolution.
- `service_flow_confirm_approved_handover`: requires customer YES and Admin approval before the Walker can record final handover completion; stores a second GPS snapshot and audit event.
- `service_flow_walker_read_scope_and_profile_policy`: grants walkers read access to dog details only when an assigned booking exists, fixes the walker subscription read join, and allows Walker self-profile edits while retaining role=walker.

Verified staging totals after these changes:
- 13 public tables; all 13 have RLS enabled.
- 54 package rows: 18 approved 30-minute rates and 36 quote-only 45/60-minute variants.
- 21 application RPC functions (plus the Auth profile trigger).
- Nine applied migrations.

The four follow-up SQL files are mirrored under `supabase/migrations/` with the exact migration versions recorded by Supabase. The original five migration SQL sources were applied before they were added to repository source control and are still not mirrored; reconstruct those five files before expecting a clean database rebuild from repository migrations.

## Client workflow wiring

Customer: profile/dog save, package lookup, manual UPI reference submission, active subscription schedule save, handover consent and walk history.

Walker: assigned duties, accept, foreground GPS arrival, start/end/report, incident submission, GPS-tagged handover request and final completion after both approvals, private payout list.

Admin: manual payment verification, up-to-30-day recurring booking generation, assignment, walk verification, handover approval, incident resolution, live package catalogue and manual payout workflow.

Still not configured: email SMTP/OTP delivery, payment gateway/QR/webhook/refunds, photo storage/evidence, background GPS/geofence, push notifications, automated payout rates, walker KYC/provisioning, leave/backup workflow and end-to-end device tests. Supabase Security Advisor continues to report authenticated SECURITY DEFINER RPC warnings; independent review is required.


The ninth staging migration adds a Walker-scoped SELECT policy for dog records only where an assigned booking exists, corrects the subscription-to-booking join in the Walker read policy, and permits Walker self-profile updates without allowing role changes. These policy definitions were verified in `pg_policies`; all 13 public tables remain RLS-enabled.


## Private handover evidence storage (2026-11-24)

The tenth staging migration creates a private `handover-evidence` bucket (5 MB maximum; JPEG/PNG/WebP only), with walker-scoped object upload and participant/Admin read policies. The Walker camera flow uploads evidence to a request-specific path and attaches it through `walker_attach_handover_evidence`. The Admin approval RPC now rejects approval unless the customer has selected YES and a valid uploaded object exists. Admin Support creates a short-lived signed URL to review the photo. Final Walker completion records a second GPS snapshot and an audit event.

Verified storage configuration and policy behavior still need device-level testing with real Walker, Customer and Admin accounts; no live handover has been performed in staging.

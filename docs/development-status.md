# Development status (updated 2026-11-24)

This is an in-progress source scaffold, not a production-ready service.

## Added
- Customer app shell and booking selection UI.
- Customer profile form UI.
- Walker app shell, duty state demo and leave request UI.
- Admin owner dashboard and workflow control centre.
- Shared booking validation, walker capacity and walk transition rules.
- OpenStreetMap configurable map component and provider policy.
- Supabase staging Service Flow schema with 13 RLS-enabled tables, 54 package rows and 12 authenticated RPCs.
- Customer and Walker Supabase clients with persisted sessions and email OTP role gates.
- Customer profile and one-dog profile save/load connected to staging tables.
- Booking screen reads approved package prices from the live staging catalogue; 45/60-minute packages remain Admin quote-only.
- Admin console OTP gate that checks the signed-in profile's admin role.
- Staging environment templates and backend setup documentation.

## Not yet implemented / verified
- Email OTP provider/SMTP configuration and real mailbox sign-in tests.
- Persisted customer/dog profile, booking and schedule screens wired to the RPCs.
- Admin live assignment/verification screens wired to the backend.
- Hiring document upload, KYC review, training records and secure walker provisioning UI.
- Assignment optimization, permanent primary walker enforcement and travel-time conflict checks.
- Device GPS permissions, reliable background tracking, route navigation and arrival geofence.
- Photo storage, push notifications and real-time Admin operations.
- Leave approvals, backup assignment transactions, customer outside consent and audit persistence.
- Payment gateway/webhook, payroll ledger, payout approvals, refunds and reconciliation.
- Automated tests, Android builds, device QA, deployment and security review.

## Owner integration handoff
The mobile and admin clients use only the staging project's publishable key and rely on database RLS plus role checks. Do not add service-role credentials to frontend apps. First provision the initial Admin profile through a trusted owner-side process, then provision Walker profiles only after recruitment approval. Verify OTP delivery and RLS behavior with separate customer, walker and admin accounts before connecting live operations.

## Admin operations screens added (demo-only)
- `/customers`: customer and dog register table with search and service-area filter.
- `/bookings`: monthly/temporary booking list and plan catalogue selector.
- `/walkers`: candidate pipeline and activation checklist.
- `/assignments`: primary walker assignment desk and workload guardrails.
- `/leave`: weekly-off/emergency leave queue and backup workflow.
- `/finance`: customer price reference, collections handoff and walker payroll separation.
- Owner sidebar now routes to these screens.

These pages use illustrative records and explanatory controls only. Buttons labelled API-required do not create or change records. No live customer, walker, payment, KYC, location or payroll records are displayed.

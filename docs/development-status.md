# Development status (updated 2026-11-24)

DOJO WALK is a staging-connected product implementation, not a production-ready live service.

## Implemented on staging

- 13 public tables with RLS enabled.
- 54 package rows: 18 approved 30-minute prices and 36 quote-only 45/60-minute combinations.
- 12 original Service Flow RPCs plus 10 operational RPCs for handover photo upload/completion, incidents and payout workflow (22 application RPCs total).
- Customer and Walker Expo clients with persistent Supabase sessions and email OTP role gates.
- Admin Next.js OTP gate with database role check.
- Customer profile and dog profile save/load.
- Customer package catalogue lookup, manual UPI reference submission, active subscription schedule setup and live walk history.
- Admin manual payment review/activation, recurring booking generation up to 30 days, walker assignment and completed-walk verification.
- Walker assigned-duty list, accept, foreground GPS arrival snapshot, start, end and report submission.
- Outside handover request with GPS snapshot, private camera photo upload, customer photo review and YES/NO consent, Admin photo review/approval and walker completion confirmation with a second GPS audit event.
- Incident report submission and Admin resolution.
- Manual payout drafts restricted to walkers with verified completed walks; Admin approve/mark paid; Walker can see own payout records.
- Admin pricing catalogue reads the staging package rows. No derived 45/60-minute prices are displayed.

## Still required before launch

- Configure Supabase Auth email provider/SMTP and test actual customer, walker and Admin mailboxes.
- Provision initial Admin and approved Walker profiles through trusted owner-side tooling. There is no self-service role promotion.
- Payment gateway, UPI QR/deep link, webhook verification, refunds and reconciliation. Current checkout accepts a manual UPI transaction reference only.
- Photo upload is now implemented in a private Storage bucket with walker-scoped upload and customer/Admin/walker read policies. Device-level photo upload and review still need testing.
- Continuous/background GPS, arrival geofence, route navigation and live Realtime map. Current arrival is a foreground GPS snapshot.
- Push notifications and real-time Admin updates.
- Leave approval and backup-walker transaction workflow.
- Permanent primary walker enforcement, travel-time conflict checks and route-aware capacity optimization.
- Walker pay rate approval. Payroll is manual Admin-entered amount; no rate is invented or auto-calculated.
- Full customer/walker/admin RLS and RPC integration tests, automated tests, Android build/device QA, security review and deployment.

## Staging database and source-control notes

The separate staging project has 11 applied migrations, 13 RLS-enabled tables and 22 application RPCs (plus the Auth profile trigger). The original five database migrations were applied before their SQL source files were added to the repository; the six follow-up migration SQL files are mirrored with the applied versions. The original five core migration SQL sources are still missing and must be reconstructed before a clean database rebuild from repository migrations. Reconstruct and commit the first five SQL sources before relying on a clean database rebuild from repository migrations.

All new client configuration uses the staging publishable key, never a service-role key. The existing populated Supabase project was not modified.

## Admin pages

Live staging-backed: `/payments`, `/bookings`, `/finance`, `/support`. The `/assignments` route forwards to live booking assignment.

Still demo/scaffold: customer CRM, walker recruitment/KYC, leave and backup management, reports and several settings/live-operations widgets. These do not create live records.

## Security

RLS is enabled on all 13 public tables. SECURITY DEFINER functions have fixed empty search paths and explicit role/ownership/state checks, but Supabase Security Advisor warnings remain and independent security testing is required. Do not treat RLS enabled alone as proof that every access policy is correct.

# Staging backend connection setup

All three app surfaces connect to the separate Supabase staging project using its publishable key and RLS.

## Environment

- Customer Expo: `apps/customer/.env.example`
- Walker Expo: `apps/walker/.env.example`
- Admin Next.js: `apps/admin/.env.example`

Each template contains the staging URL and client-safe publishable key. Copy to `.env` in the app folder and restart the dev server. Never use a Supabase secret/service-role key in frontend code.

## Operational flow now wired

1. Customer signs in by email OTP, saves customer/dog profile, selects a published package and submits a manual UPI transaction reference.
2. Admin verifies actual payment against the bank/UPI account. Approval activates subscription.
3. Customer saves address and Single or Double schedule. Single plans choose either morning or evening; Double plans require both.
4. Admin generates up to 30 days of Monday–Saturday bookings, assigns an approved active walker and verifies walk reports.
5. Walker sees only assigned duties, accepts, marks arrival using a foreground GPS snapshot, starts and ends the walk, and submits a report.
6. Customer can view walk history. Outside handover requests require GPS, a private camera photo upload, explicit customer YES, Admin approval after photo review and a final walker completion confirmation with another GPS audit snapshot. Incidents are recorded and resolved by Admin.
7. Admin creates payout drafts only for walkers with verified completed walks in the period, manually enters the amount, approves and marks paid. Walker sees only their own payout records.

## Configuration and launch prerequisites

- Email OTP delivery depends on Supabase Auth email provider and SMTP configuration.
- Provision the initial Admin profile and approved Walker profiles through a trusted owner-side process. Never allow users to self-assign roles.
- Manual UPI reference is not a payment gateway. No QR, webhook, auto reconciliation or refund automation is configured.
- Walker arrival uses a foreground GPS snapshot only. No continuous/background tracking or arrival geofence is implemented. Handover photo evidence uses a private Storage bucket and is required by the Admin approval RPC.
- Walker pay rate has not been approved. Payout amount is therefore entered by Admin; no pay rate is invented or auto-calculated.
- Test three separate customer, walker and admin accounts, RLS ownership boundaries, all RPC transitions and failed-network retry behavior before launch.
- Security Advisor warnings for SECURITY DEFINER RPCs require an independent review; the functions use fixed search paths and role/ownership checks, but that is not a substitute for penetration testing.

This remains a staging implementation, not a live production service. Android builds, app-store configuration, SMTP, storage, push notifications, payment gateway, background GPS and end-to-end device QA remain outstanding.

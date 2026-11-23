# Development status (updated 2026-11-24)

This is an in-progress source scaffold, not a production-ready service.

## Added
- Customer app shell and booking selection UI.
- Customer profile form UI.
- Walker app shell, duty state demo and leave request UI.
- Admin owner dashboard and workflow control centre.
- Shared booking validation, walker capacity and walk transition rules.
- OpenStreetMap configurable map component and provider policy.
- Pricing and backend integration documentation.

## Not yet implemented / verified
- Production OTP authentication and role authorization.
- Persisted customer/dog profiles, bookings and schedule engine.
- Real package pricing catalogue, checkout and payment verification.
- Hiring document upload, KYC review, training records and secure activation.
- Assignment optimization and recurring schedule generation.
- Device GPS permissions, reliable background tracking, route navigation and arrival geofence.
- Photo storage, push notifications and real-time Admin operations.
- Leave approvals, backup assignment transactions, customer outside consent and audit persistence.
- Payroll ledger, payout approvals, refunds and reconciliation.
- Automated tests, Android builds, device QA, deployment and security review.

## Owner integration handoff
Database and API are intentionally not configured. Connect backend adapters, enforce authorization server-side, and add row-level policies before any real customer or walker data is used.

## Admin operations screens added (demo-only)
- `/customers`: customer and dog register table with search and service-area filter.
- `/bookings`: monthly/temporary booking list and plan catalogue selector.
- `/walkers`: candidate pipeline and activation checklist.
- `/assignments`: primary walker assignment desk and workload guardrails.
- `/leave`: weekly-off/emergency leave queue and backup workflow.
- `/finance`: customer price reference, collections handoff and walker payroll separation.
- Owner sidebar now routes to these screens.

These pages use illustrative records and explanatory controls only. Buttons labelled API-required do not create or change records. No live customer, walker, payment, KYC, location or payroll data is present.

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

## Customer and walker app screens added (demo-only)
- Customer booking: enforces 30 days for monthly and 1–15 days for temporary; includes Single/Double, 30/45/60-minute options, service windows and a visible price estimate. The approved 30-minute totals are used; 45/60-minute values are proportional estimates only.
- Customer profile: customer contact/address and dog breed, age, temperament, care instructions, vet and emergency contact fields.
- Customer activity: sample walk-history view.
- Walker report: behaviour, walk notes and incident detail form.
- Walker earnings: monthly payout explanation and privacy separation.
- Walker outside handover: explicit customer YES plus Admin approval sequence is documented; no handover action is enabled.
- Walker incident report: incident type, immediate danger and factual report fields.
- Customer and walker home screens link to the added screens.

These screens are UI scaffolds. State is temporary, sample records are illustrative, and buttons do not persist data or trigger external actions. No app build, TypeScript check, automated test or device QA has been run.

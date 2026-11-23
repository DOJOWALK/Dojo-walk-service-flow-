# Backend integration contract

No database or API is configured yet. Keep all backend calls behind typed service adapters.

## Service modules to implement later
- Auth: request OTP, verify OTP, sign out, role/session lookup.
- Customer: profile, address, dog profiles, emergency contacts.
- Booking: package catalogue, quote, availability, create booking, payment status.
- Assignment: permanent primary walker, backup, max-10 capacity and travel-time validation.
- Schedule: recurring schedule, off days, leave, holiday and next-day publication.
- Walk: state transitions, GPS points, arrival checks, start/end confirmations, proofs and incident reporting.
- Handover: walker request, customer consent, admin approval, final handover audit.
- Finance: customer payments, refunds/adjustments, walker payout ledger and monthly payroll.

## Suggested entities
users, user_roles, customers, dogs, service_areas, walkers, walker_documents, packages, customer_prices, walker_rates, bookings, assignments, walk_schedules, walk_sessions, gps_points, walk_proofs, leave_requests, handover_requests, payments, walker_payouts, complaints, incidents, notifications, audit_logs.

## Security
Enforce role authorization server-side and row-level access control. Never ship privileged service keys in mobile or browser bundles. Keep customer payment details private from walkers and walker payouts private from customers.
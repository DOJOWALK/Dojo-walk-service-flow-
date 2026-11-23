# Staging backend connection setup

All three app surfaces now have Supabase client/auth integration:

- Customer and Walker Expo apps: persistent Supabase client with email OTP. Customer can create an account; Walker login is restricted to an already provisioned Walker profile.
- Admin Next.js console: email OTP login, then a database profile role check requiring `admin`.

## Environment

Copy the relevant `.env.example` to `.env` inside each app folder:

- `apps/customer/.env.example`
- `apps/walker/.env.example`
- `apps/admin/.env.example`

Set the staging project's publishable key. The URL is already prefilled. Restart the app/dev server after editing environment variables.

Never use a Supabase secret/service-role key in a client app. The publishable key is intended for client use; row-level security remains the actual data-access boundary.

## Provisioning and test requirements

- Customer profile creation is handled by the staging auth trigger.
- Walker accounts must be created and approved by a trusted Admin process before Walker sign-in succeeds.
- The initial Admin profile must be assigned `role = 'admin'` through a trusted owner-side process; never allow users to self-assign roles.
- Email OTP delivery depends on Supabase Auth provider and SMTP configuration.
- Test three separate accounts (customer, walker, admin), RLS ownership boundaries, and session persistence before launch.

## Not yet wired

These changes connect the client and authentication layer only. Customer booking forms, package payment submission, recurring schedule UI, Walker duty actions, Admin assignment/verification, GPS tracking, photo evidence, handover approval, payment gateway and payroll still need integration and end-to-end verification.

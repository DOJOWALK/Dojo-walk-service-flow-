# Staging backend connection setup

All three app surfaces now have Supabase client/auth integration:

- Customer and Walker Expo apps: persistent Supabase client with email OTP. Customer can create an account; Walker login is restricted to an already provisioned Walker profile.
- Admin Next.js console: email OTP login, then a database profile role check requiring `admin`.

## Environment

Each app has a ready-to-copy `.env.example`:

- `apps/customer/.env.example`
- `apps/walker/.env.example`
- `apps/admin/.env.example`

The staging URL and **publishable** key are prefilled. These values are intended for client-side use; they are not service-role or secret keys. For local development, copy the file to `.env` in that app folder and restart the dev server. For EAS/hosted deployments, add the same variables to that platform's environment settings.

Never use a Supabase secret/service-role key in a client app. The publishable key is not an authorization boundary; row-level security and server-side role checks protect data.

## Provisioning and test requirements

- Customer profile creation is handled by the staging auth trigger.
- Walker accounts must be created and approved by a trusted Admin process before Walker sign-in succeeds.
- The initial Admin profile must be assigned `role = 'admin'` through a trusted owner-side process; never allow users to self-assign roles.
- Email OTP delivery depends on Supabase Auth provider and SMTP configuration.
- Test three separate accounts (customer, walker, admin), RLS ownership boundaries, and session persistence before launch.

## Not yet wired

These changes connect the client and authentication layer only. Customer booking forms, package payment submission, recurring schedule UI, Walker duty actions, Admin assignment/verification, GPS tracking, photo evidence, handover approval, payment gateway and payroll still need integration and end-to-end verification.

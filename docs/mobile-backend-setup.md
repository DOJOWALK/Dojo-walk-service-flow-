# Mobile staging backend setup

Both Expo apps now have a persistent Supabase client and an email OTP role gate.

1. Copy `.env.example` to `.env` in each app folder.
2. Replace `YOUR_STAGING_PUBLISHABLE_KEY` with the staging project's publishable key from Supabase Project Settings → API Keys.
3. Never put a Supabase secret/service-role key in an Expo app.
4. Restart Expo after changing environment variables.

Customer accounts can be created through email OTP. Walker accounts are sign-in-only and must first be provisioned/approved by an administrator with `profiles.role = 'walker'`. The role gate reads the signed-in user's own profile under RLS; it does not trust client-supplied role metadata.

Email OTP delivery depends on the Supabase Auth email provider and SMTP configuration. Test with a real mailbox before release. These changes connect the apps to staging but do not yet wire booking screens, GPS, payment gateway, or walker duty actions to RPCs.

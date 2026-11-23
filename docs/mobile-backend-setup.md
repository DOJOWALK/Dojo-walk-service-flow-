# Connect mobile apps to staging

1. Copy this file to `.env` in the app folder.
2. Replace `YOUR_STAGING_PUBLISHABLE_KEY` with the staging project's publishable key from Supabase Project Settings → API Keys.
3. Never put a Supabase secret/service-role key in an Expo app.
4. Restart Expo after changing environment variables.

The client persists authenticated sessions on-device and uses the staging project's RLS policies. Auth providers (email/phone OTP) must be enabled in Supabase before sign-in flows can be used.

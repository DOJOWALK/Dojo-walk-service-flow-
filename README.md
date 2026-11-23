# DOJO WALK

Managed dog-walking operations platform for Gaur City 1, Gaur City 2 and Crossings Republik.

## Product surfaces

- `apps/customer`: Expo / React Native customer Android app
- `apps/walker`: Expo / React Native walker Android app
- `apps/admin`: Next.js owner/admin web console
- `packages/domain`: shared booking, walk lifecycle, capacity and handover rules
- `docs`: service flow, pricing, map policy, integration contract and development status

## Business rules

- Managed service, not a marketplace. The company recruits, verifies, trains and assigns walkers.
- Monthly plans are 30 days only. Temporary plans are 1–15 days.
- Single or Double service; each walk is for one dog only.
- Durations: 30, 45 or 60 minutes.
- Monthly customers keep one primary walker for morning and evening where feasible.
- A walker has a maximum of 10 assigned dogs, subject to safe schedule and travel-time checks.
- Morning service window: 05:00–11:00. Evening: 16:00–22:00.
- Leave, backup assignment and outside handover require admin approval; outside handover also requires explicit customer YES.
- Customer-facing prices and internal walker rates are separate.
- Walk lifecycle: Assigned → Navigating → Arrived → In Progress → End Pending → Completed; exceptions include Review, Missed and Incident.

## Areas

- Gaur City 2
- Gaur City 1
- Crossings Republik

## Maps

OpenStreetMap data is used for map display. The standard OSM tile service is best-effort, not a commercial SLA; production must use a compliant tile provider or self-hosted tiles at scale. Always show © OpenStreetMap contributors attribution and respect tile caching / identification policies. Customer map tiles are configured through `EXPO_PUBLIC_OSM_TILE_URL`.

## Backend integration

A separate Supabase staging project is configured for app integration. It contains the Service Flow schema, RLS-enabled tables, package catalogue and authenticated RPCs. Customer and Walker Expo apps now include a persistent Supabase client and email OTP role gate; the Admin console also requires an Admin-role OTP session.

Before running any app, copy each app's `.env.example` to `.env` and set the staging publishable key. Never expose a Supabase secret/service-role key in a client app. See [mobile/admin backend setup](docs/mobile-backend-setup.md).

Customer profile save/load, package payment-reference submission, schedule save, walk history, Walker duty lifecycle, foreground GPS arrival, Admin payment verification, booking generation/assignment/walk verification, primary-walker continuity, approved-leave backup assignment, handover photo consent/completion, incident resolution and manual payout ledger are connected to staging. The database enforces a 10-dog cap and 30-minute scheduling buffer. Actual payment gateway, background GPS/geofence, push notifications, production payroll rates and end-to-end QA remain outstanding. Private photo evidence for outside handovers is now wired, but device testing remains outstanding. The staging backend is not production and the existing populated Supabase project has not been modified.

## Local development

This is an npm workspaces repository. From the repository root, install workspace dependencies with `npm install`, then use:

- `npm run customer` — starts the customer Expo app
- `npm run walker` — starts the walker Expo app
- `npm run admin` — starts the Next.js admin console

The customer and walker projects also expose `typecheck` scripts. The admin project exposes `typecheck` and `build`. Run `npm run check` before release and resolve any errors.

## Customer map release configuration

- Customer app pins `react-native-maps` to the Expo SDK 58 documented compatible version.
- Set `GOOGLE_MAPS_API_KEY` as a protected EAS environment variable before Android release builds. The app config reads it at build time; never commit the key.
- Configure `EXPO_PUBLIC_OSM_TILE_URL` with a production-appropriate tile provider.

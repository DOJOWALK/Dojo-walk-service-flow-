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

## Backend integration boundary

Database and API integration are intentionally deferred. No Supabase project, API keys, OTP provider, payment gateway or production backend is configured. Add those later through environment variables and server-side adapters; never commit secrets. Current screens show demo data and temporary local state only.

## Local development

This is an npm workspaces repository. From the repository root, install workspace dependencies with `npm install`, then use:

- `npm run customer` — starts the customer Expo app
- `npm run walker` — starts the walker Expo app
- `npm run admin` — starts the Next.js admin console

The customer and walker projects also expose `typecheck` scripts. The admin project exposes `typecheck` and `build`. These commands have not yet been run in this repository session; check SDK/package compatibility and resolve any errors before release.

## Validation and Android builds

From the repository root:

- `npm install` — install workspace dependencies
- `npm run typecheck` — run Customer, Walker and Admin TypeScript checks
- `npm run build` — create the Admin production build
- `npm run check` — run type checks followed by the Admin production build

For Android internal-test APKs, run EAS from each app directory after configuring that app as an EAS project:

- Customer: `cd apps/customer && npx eas-cli build --platform android --profile preview`
- Walker: `cd apps/walker && npx eas-cli build --platform android --profile preview`

The production profile creates an Android App Bundle. EAS project IDs, Android signing setup, and real cloud builds are not configured or completed yet. Do not distribute a build until authentication, privacy, backend, and device QA are complete.

## Pricing

The approved 30-minute customer price cards and proportional 45/60-minute estimates are documented in `docs/pricing.md`. Walker payout rates remain an independent admin-only configuration and are not exposed to customers.

## Status

Progressive source scaffold with demo-only app screens and shared business rules. It is not yet tested, production-connected or ready for customer use. See `docs/development-status.md` for the current implementation and integration gaps.

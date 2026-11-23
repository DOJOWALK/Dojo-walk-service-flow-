# DOJO WALK

Managed dog-walking operations platform for Gaur City 1, Gaur City 2 and Crossings Republik.

## Product surfaces

- `apps/customer`: Expo / React Native customer Android app
- `apps/walker`: Expo / React Native walker Android app
- `apps/admin`: Next.js owner/admin web console
- `packages/domain`: shared business rules, types and mock data
- `packages/maps`: OpenStreetMap configuration and map helpers
- `docs`: service flow, setup and integration contracts

## Business rules

- Managed service, not a marketplace. The company recruits, verifies, trains and assigns walkers.
- Monthly plans are 30 days only. Temporary plans are 1–15 days.
- Single or Double service; each walk is for one dog only.
- Durations: 30, 45 or 60 minutes.
- Monthly customers keep one primary walker for morning and evening where feasible.
- A walker has a maximum of 10 assigned dogs, subject to safe schedule and travel-time checks.
- Morning service window: 05:00–11:00. Evening: 16:00–22:00.
- Leave, backup assignment and outside handover require admin approval.
- Customer-facing prices and internal walker rates are separate.
- Walk lifecycle: Assigned → Navigating → Arrived → In Progress → End Pending → Completed; exceptions include Review, Missed and Incident.

## Areas

- Gaur City 2
- Gaur City 1
- Crossings Republik

## Maps

OpenStreetMap data is used for map display. The standard OSM tile service is best-effort, not a commercial SLA; production must use a compliant tile provider or self-hosted tiles at scale. Always show © OpenStreetMap contributors attribution and respect tile caching / identification policies. Tile URL is configurable rather than hard-coded across the app.

## Backend integration boundary

This repository starts with mock/local data and typed service interfaces. No Supabase project, API keys, OTP provider, payment gateway or production backend is configured. Add those later through environment variables and server-side adapters; never commit secrets.

## Local development

Each app has its own README and package scripts. Install dependencies from the relevant app directory, then run its development script. The apps are intentionally separated so customer, walker and admin experiences can evolve independently.

## Pricing

The approved 30-minute customer price cards and the proportional 45/60-minute derivations are documented in `docs/pricing.md`. Walker payout rates remain an independent admin-only configuration and are not exposed to customers.

## Status

Initial repository scaffold. UI and workflows are progressively implemented; this is not yet a production-connected service.
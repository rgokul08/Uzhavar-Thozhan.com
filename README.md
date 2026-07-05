# Uzhavar Thozhan (உழவர் தோழன்) — Farmer's Companion Platform

A Next.js 14 (App Router) + TypeScript + Tailwind + Prisma scaffold covering all
13 requested farmer features. This is a **working skeleton**: pages, API routes,
and a full database schema are in place with mock/placeholder data so you can
see every screen immediately — real integrations (payments, video calls, SMS
OTP, weather provider, government data feeds) are marked with `TODO` comments.

## Feature → file map

| # | Feature | Page | API route |
|---|---|---|---|
| 1 | Farmer login/register | `app/login`, `app/register` | `app/api/auth/*` |
| 2 | Crop-to-soil matching | `app/crops` | `app/api/crops/recommend` |
| 3 | Govt. laws & subsidies | `app/schemes` | `app/api/schemes` |
| 4 | Weather updates | `app/weather` | `app/api/weather` |
| 5 | Seasonal plant suggestions | `app/seasonal` | (static + Crop table) |
| 6 | Crop insurance | `app/insurance` | `app/api/insurance` |
| 7 | Claim insurance | `app/insurance/claim` | `app/api/insurance/claim` |
| 8 | Video call with expert | `app/consult` | `app/api/consult` |
| 9 | Buy pesticides/medicines | `app/seeds` (category filter) | `app/api/seeds` |
| 10 | Sell produce direct to market | `app/marketplace`, `app/marketplace/sell` | `app/api/marketplace` |
| 11 | Farm loans | `app/loans` | `app/api/loans` |
| 12 | Book equipment/robots | `app/equipment` | `app/api/equipment` |
| 13 | Buy seeds | `app/seeds` (category filter) | `app/api/seeds` |

Dashboard (`app/dashboard`) is the logged-in farmer's home screen tying all of
the above together.

## Getting started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL at minimum
npx prisma migrate dev --name init
npm run dev
```

## What's real vs. placeholder right now

- **Real:** routing, layout, Tailwind design system, Prisma schema for all
  13 domains, working register/login (bcrypt + JWT cookie), CRUD API routes
  for crops/schemes/insurance/claims/consultations/products/marketplace/loans/equipment.
- **Placeholder / mocked:** weather data (static mock JSON — swap in a real
  provider), video call rooms (a fake room id — swap in Agora/Twilio/100ms),
  payments (no gateway wired yet), file uploads (no storage wired yet),
  session-based `farmerId` in forms (currently hardcoded `"TODO"` — wire up
  once you add server-side session reading via `lib/auth.ts#verifySession`).

## Next step

Hand `CLAUDE_CODE_PROMPT.md` to Claude Code in this repo to build out the
remaining integrations feature-by-feature.

# Uzhavar Thozhan (உழவர் தோழன்) — v2

A single web platform for Indian farmers, upgraded to a premium-feeling stack:
**Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Framer
Motion + GSAP + Three.js / React Three Fiber**, data and auth on **Supabase**
(Postgres + Auth + RLS), an **OpenAI-backed AI assistant**, deployed on
**Vercel**.

---

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run the entire contents of `supabase/schema.sql` top to
   bottom (it's additive — v1 tables, then the v2 additions below the `-- v2`
   markers: soil report history, weather logs, disease detections, reviews,
   wishlist, cart, messages, blogs, support tickets, files, admin roles +
   audit log, and the extra registration columns on `farmer_profiles`).
3. **Phone OTP** (`/auth/login`): enable **Authentication -> Providers ->
   Phone**, connect an SMS provider (Twilio/MSG91/etc — your own
   credentials, entered in Supabase, never in this codebase), and set **OTP
   length to 8** in Authentication -> Settings.
4. **Email OTP** (`/auth/login-otp`): enable **Authentication -> Providers ->
   Email**. Supabase's default email OTP expiry is 1 hour — if you want it
   to match the 5-minute countdown shown in the UI, set **Email OTP expiry**
   to `300` seconds in Authentication -> Settings.
5. **Email + password** (`/auth/login-password`, `/auth/register`): works
   out of the box once the Email provider is on.
6. Copy your **Project URL** and **anon public key** from
   **Project Settings -> API**.
7. To try the **admin panel** (`/admin`), insert your own user id into
   `admin_roles` after you've registered once:
   ```sql
   insert into admin_roles (id, role) values ('<your-auth-user-id>', 'superadmin');
   ```

## 3. Environment variables

Copy `.env.example` -> `.env.local` for local dev, and add the same values in
**Vercel -> Project Settings -> Environment Variables** for production.
Nothing secret is hardcoded in source.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, optional for now
OPENAI_API_KEY=              # powers /dashboard/assistant — omit to leave it gracefully disabled
```

## 4. Run locally / Deploy

```bash
npm run dev
```

Push to GitHub, import into Vercel (auto-detects Next.js), add the env vars
above before the first deploy.

---

## Honest status: what's real vs. what's scaffolded

This upgrade is large — full parity with an enterprise platform like CropIn
is a multi-month build. Here's exactly where things stand, so nothing is a
surprise:

### Fully working, real backend logic
- 8-digit phone OTP login, 8-digit **email OTP login** (with 5-min expiry
  countdown + 60s resend cooldown), **email+password login** with Remember
  Me, **forgot/reset password**, and a full **registration form**
  (react-hook-form + zod validated) collecting every field you listed
- Dark/light theme (next-themes), **command palette** (Cmd/Ctrl+K)
- 3D animated hero (Three.js / React Three Fiber): rolling wind-animated
  field, sun, low-poly mountains, drifting clouds, birds, particle "leaves",
  mouse-parallax camera
- GSAP scroll-triggered count-up stats
- AI assistant chat (English/Tamil/Hindi), wired to OpenAI — real answers
  once you add `OPENAI_API_KEY`
- Soil health score engine: enter a soil test card, get a computed 0-100
  score, a radar chart (Recharts), and rule-based fertiliser advice
- Crop planning by soil/NPK/pH, seasonal guide, live keyless weather
  (Open-Meteo), government schemes (seeded real schemes), crop insurance +
  claims, expert video consultations (real Jitsi rooms, no API key), input
  marketplace ordering, produce sell-listings, loan applications, equipment
  booking, community forum — all from v1, all Supabase-backed
- Minimal **admin overview** (`/admin`, role-gated) reading live platform
  stats from a Postgres view

### Schema is ready, UI is not built yet (fastest path to finishing each)
- **Disease detection**: `disease_detections` table exists; you need an
  image-classification model or a vision API (e.g. GPT-4o vision, Plant.id)
  — the upload UI and API route are a straightforward add once you pick a
  provider and get a key
- **Cart / wishlist / reviews**: tables exist (`cart_items`, `wishlists`,
  `reviews`); marketplace UI currently orders directly rather than using a
  cart — wiring the existing tables into `/dashboard/marketplace` is a
  focused follow-up
- **Messages** (farmer<->expert chat): table + RLS exist; no chat UI yet
  (Supabase Realtime subscriptions are the natural fit)
- **Blogs/CMS, support tickets UI, audit log viewer**: tables exist; admin
  UI to manage them is not built beyond the stats overview
- **Google Maps / Leaflet farm map picker**: not implemented — needs your
  Google Maps API key or a Leaflet + OpenStreetMap setup (keyless
  alternative if you'd rather avoid a Google Cloud bill)
- **PWA / offline mode**: no manifest or service worker yet
- **Payments** (insurance premiums, loan disbursement, marketplace
  checkout): recorded in Supabase but not connected to Razorpay/Stripe

Building every remaining item to the same depth as what's listed under
"fully working" is realistic as a series of focused follow-ups — happy to
build out any specific one of these next.

## Folder structure

```
app/
  page.tsx                        Landing page (3D hero, feature grid, stats)
  auth/                           login (phone), login-otp (email), login-password,
                                   register, forgot-password, reset-password, verify
  dashboard/                      15 farmer-facing features, protected by middleware.ts
  admin/                          Role-gated admin overview
  api/assistant/route.ts          OpenAI-backed chat endpoint
components/                       Navbar, Sidebar, FarmScene (R3F), CommandPalette, ThemeToggle, etc.
lib/supabase/                     Browser + async server Supabase clients
lib/data/                         Crop recommendation + seasonal data
supabase/schema.sql               Full schema (21 tables + views), RLS policies, seed data
middleware.ts                     Auth gate for /dashboard and /admin
```

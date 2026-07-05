# Build Prompt for Claude Code — Uzhavar Thozhan (உழவர் தோழன்)

Paste this whole file as your instruction to Claude Code, run from inside this
repo (a Next.js 14 App Router + TypeScript + Tailwind + Prisma scaffold
already exists — read `README.md` first). Work feature by feature, in the
order listed, committing after each one.

## Context

**Uzhavar Thozhan** ("farmer's companion") is a single platform that replaces
the many separate offices and apps a farmer currently has to deal with. The
user is a small/marginal farmer in Tamil Nadu, India, often with limited
literacy and an Android phone as their primary device. Design and build for
that person first: large tap targets, simple language, works on slow mobile
networks, and every flow reachable in 2–3 taps from the home screen.

The repo already has: page routes, API route stubs, a Prisma schema modeling
all 13 features, a Tailwind design system (paddy green / turmeric gold / clay
brown / rice-husk background), and mock data where a real integration is
still needed. Your job is to replace every `TODO` with a real implementation
and harden what already exists. Do not remove the existing visual design
language unless asked.

## Ground rules

- Keep using Next.js App Router, TypeScript, Tailwind, and Prisma — don't
  introduce a different framework or ORM.
- Every page must work on a 360px-wide screen and on a throttled 3G
  connection (test with Chrome DevTools network throttling).
- All farmer-facing text should have an accompanying Tamil translation
  path — don't hardcode English-only strings; use a simple i18n approach
  (e.g. `next-intl` or a lightweight custom dictionary) with English and
  Tamil (`ta`) locales to start.
- Never invent government scheme names, loan interest rates, or insurance
  terms — either source them from a real public dataset/API the user
  provides, or clearly mark seeded data as `[SAMPLE DATA]` in the admin UI.
- Add loading and empty states to every list view (already started —
  keep the pattern).
- Write API input validation with `zod` (already used in the auth routes)
  for every route you touch.
- After each feature, run `npm run build` and fix any type errors before
  moving to the next.

## Build order

### 1. Authentication & farmer session (harden feature 1)
- Read the `session` cookie server-side (`lib/auth.ts#verifySession`) in a
  shared helper (e.g. `lib/getCurrentFarmer.ts`) and use it in
  `app/dashboard`, and in every API route that currently accepts a
  hardcoded `farmerId: "TODO"` from the client.
- Add an OTP-over-SMS login path as an alternative to password login
  (many farmers won't remember a password): request OTP → verify OTP →
  issue the same session cookie. Stub the SMS provider behind a
  `sendOtp(phone, code)` function in `lib/sms.ts` reading `SMS_API_KEY`.
- Add a middleware (`middleware.ts`) that redirects unauthenticated users
  away from `/dashboard`, `/insurance/claim`, `/marketplace/sell`, `/loans`,
  `/equipment`, `/consult` to `/login`.
- Add a profile page (`app/profile`) to edit name, village, and land
  details (create/edit `Land` records with soil type and N-P-K/pH inputs).

### 2. Crop-to-soil-and-chemical matching (feature 2)
- Replace the simple `has: soilType` filter in
  `app/api/crops/recommend/route.ts` with a scored match across soil type,
  pH range, and season, returning crops ranked by fit — not just exact
  matches.
- Seed the `Crop` table with a realistic starter set of Tamil Nadu field
  crops (paddy, sugarcane, groundnut, cotton, millets, pulses, vegetables)
  including `fertilizerNotes` describing the N-P-K program and any
  chemical/organic inputs recommended per growth stage. Put this seed data
  in `prisma/seed.ts` and wire up `npm run prisma:seed`.
- On `app/crops`, let the farmer pick from their saved `Land` records
  (soil type pre-filled) instead of re-entering soil type each time.

### 3. Government schemes & subsidies (feature 3)
- Build an admin-only route (`app/admin/schemes`) to create/edit/deactivate
  `GovtScheme` rows, protected by a simple role check (add a `role` field
  to `Farmer` or a separate `AdminUser` model — your call, document it).
- Add filtering by state and by scheme type (subsidy / insurance-linked /
  loan-linked / equipment-linked) on `app/schemes`.
- If the user provides a real state agriculture department API or dataset,
  write a sync job (`app/api/schemes/sync/route.ts`, called by a cron) that
  upserts into `GovtScheme`. If no such source is provided, leave schemes
  admin-managed and say so in the admin UI.

### 4. Weather (feature 4)
- Replace the mock in `app/api/weather/route.ts` with a real provider call
  (OpenWeatherMap, Tomorrow.io, or IMD if accessible), keyed by `pinCode`
  or lat/lon from the farmer's saved `Land`.
- Cache responses in the `WeatherCache` table for ~3 hours per pin code to
  avoid rate limits; serve from cache when fresh.
- Add a simple alert banner on the dashboard when the forecast includes
  heavy rain (>70% chance) or a heat warning, since this affects spraying
  and harvest timing decisions.

### 5. Seasonal suggestions (feature 5)
- Replace the static `seasons` array in `app/seasonal/page.tsx` with data
  driven by the current date + the farmer's district, pulling matching
  crops from the `Crop` table (`idealSeason`) rather than a hardcoded list.
- Cross-link each seasonal crop to its `/crops` detail so a farmer can go
  straight from "what to plant now" to the full soil/chemical guidance.

### 6 & 7. Insurance + claims (features 6 & 7)
- Seed a few `InsurancePlan` records reflecting a real or realistic scheme
  (e.g. structured like PMFBY: premium rate varies by crop type/season).
- Build the actual purchase flow on `app/insurance`: select plan → enter
  land/crop → compute premium → payment (see Payments section below) →
  create `Insurance` row on success.
- On `app/insurance/claim`, wire the photo upload input to real storage
  (see Storage section) and store resulting URLs in `photoUrls`.
- Build a claims status view (`app/insurance/claims`) listing the farmer's
  claims with their `status`, and an admin view to move a claim through
  `submitted → under_review → approved/rejected → paid`.

### 8. Video consultations with expert doctors (feature 8)
- Integrate a real video SDK (Agora, Twilio Video, or 100ms — pick one
  and document why) using `VIDEO_SDK_APP_ID`/`VIDEO_SDK_APP_SECRET`.
  On booking, generate a real room + token server-side in
  `app/api/consult/route.ts` instead of the fake `room-${Date.now()}` id.
- Build the actual call screen (`app/consult/[consultationId]`) rendering
  the SDK's video component, with a graceful fallback message if the
  farmer's browser/device doesn't support WebRTC.
- Add a real date/time picker to `app/consult` respecting each expert's
  availability (add an `availability` field or a separate slots model).
- Seed a few `ExpertDoctor` records across specialties (plant pathology,
  soil science, entomology/pest control) with Tamil + English language
  tags.

### 9 & 13. Inputs store — pesticides, medicines, seeds (features 9 & 13)
- Build the cart → checkout flow: cart state (React context or Zustand),
  a checkout page collecting delivery address, an `Order` +`OrderItem`
  created on submit, and payment (see Payments section).
- Add product detail pages (`app/seeds/[productId]`) with usage
  instructions and safety warnings for pesticides/medicines.
- Seed the `Product` table with realistic starter inventory across all
  five categories.

### 10. Direct-to-market selling (feature 10)
- Add a buyer-facing view of `app/marketplace` listings that lets a buyer
  (individual, private company, or government procurement officer) express
  interest or make an offer — this likely needs a lightweight `Buyer`
  concept or an "inquiry" model (`ListingInquiry`: listing, buyer contact,
  message, status) since the current schema only has the farmer side.
- Add a simple messaging or contact-reveal mechanism so a buyer can reach
  the farmer once a listing is marked interesting (don't expose phone
  numbers publicly by default — reveal after farmer approves an inquiry).

### 11. Farm loans (feature 11)
- Seed `LoanScheme` with realistic terms (NABARD/Kisan Credit Card style,
  or whatever real schemes the user wants represented).
- Build an actual application form (`app/loans/[schemeId]/apply`) collecting
  the documents a lender would need (land ownership proof, Aadhaar-linked
  ID, bank account) with file upload, rather than instantly creating a
  `Loan` row on button click as the current placeholder does.
- Build a status tracker (`app/loans/mine`) showing each application's
  progress through `submitted → under_review → approved/rejected →
  disbursed → closed`.

### 12. Equipment / robot booking (feature 12)
- Add a real calendar-based availability check before confirming a
  booking (prevent double-booking the same `Equipment` for overlapping
  date ranges) — enforce this in `app/api/equipment/route.ts`.
- Seed `Equipment` with realistic categories (drone sprayer, power tiller,
  combine harvester, seed drill) and daily rates.
- Add a booking confirmation + cancellation flow, and surface upcoming
  bookings on the dashboard.

## Cross-cutting integrations

### Payments
Add a `lib/payments.ts` wrapping Razorpay (`RAZORPAY_KEY_ID` /
`RAZORPAY_KEY_SECRET`) with two functions: `createOrder(amountPaise)` and
`verifyPayment(orderId, paymentId, signature)`. Use it for: insurance
premium payment, inputs-store checkout, and equipment booking payment.
Loan disbursement is NOT a payment you collect — don't wire it the same way.

### File storage
Add `lib/storage.ts` wrapping S3-compatible storage (`STORAGE_BUCKET`,
`STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`) with an `uploadFile(file)`
helper returning a public URL. Use it for insurance claim photos, loan
application documents, and land/profile photos.

### Notifications
Farmers need to know about claim status changes, loan decisions, booking
confirmations, and weather alerts without checking the site. Add a basic
SMS notification hook (reuse `lib/sms.ts` from the auth section) fired on
key status transitions. Email is a secondary channel if the farmer has one.

### Accessibility & localization
- Every interactive element needs a visible focus state (base styles
  already set this globally in `app/globals.css` — keep it that way for
  any new components).
- Add a language switcher (English / தமிழ்) in the navbar once i18n is
  wired up.
- Icons should never be the only way to understand an action — pair with
  a text label, especially for low-literacy users.

## Testing expectations

- Add at least one integration test per feature's API route (happy path +
  one validation-failure path) using a test runner of your choice
  (Vitest recommended, already TypeScript-native).
- Manually verify each of the 13 features end-to-end on a mobile viewport
  before considering a feature "done."

## Definition of done for the whole project

All 13 features have: a real (non-mocked) backend integration where one is
listed above, seeded realistic sample data, mobile-first responsive UI,
loading/empty/error states, and are reachable from both the homepage grid
and the farmer dashboard. `npm run build` passes with zero type errors.

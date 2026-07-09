-- ============================================================================
-- Uzhavar Thozhan — Supabase schema
-- Run this in Supabase Dashboard > SQL Editor (or `supabase db push`)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. FARMER PROFILES (phone OTP is handled by Supabase Auth itself —
--    this table stores the extra farming details tied to auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.farmer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  village text,
  district text,
  state text,
  pincode text,
  land_size_acres numeric,
  soil_type text, -- alluvial, black, red, laterite, arid, saline, peaty, forest
  preferred_language text default 'ta',
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.farmer_profiles enable row level security;
create policy "farmer reads own profile" on public.farmer_profiles
  for select using (auth.uid() = id);
create policy "farmer updates own profile" on public.farmer_profiles
  for update using (auth.uid() = id);
create policy "farmer inserts own profile" on public.farmer_profiles
  for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2. LAND PARCELS (soil type + chemical composition per plot, feeds crop engine)
-- ---------------------------------------------------------------------------
create table if not exists public.land_parcels (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  name text not null,
  area_acres numeric not null,
  soil_type text not null,
  nitrogen_ppm numeric,
  phosphorus_ppm numeric,
  potassium_ppm numeric,
  ph_level numeric,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);
alter table public.land_parcels enable row level security;
create policy "farmer manages own parcels" on public.land_parcels
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 3. CROP PLANTINGS (what got planted on a parcel, recommendation accepted)
-- ---------------------------------------------------------------------------
create table if not exists public.crop_plantings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  parcel_id uuid references public.land_parcels(id) on delete cascade,
  crop_name text not null,
  season text not null, -- kharif, rabi, zaid
  planted_on date default current_date,
  expected_harvest date,
  status text default 'growing', -- growing, harvested, failed
  created_at timestamptz default now()
);
alter table public.crop_plantings enable row level security;
create policy "farmer manages own plantings" on public.crop_plantings
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 4. GOVERNMENT SCHEMES (read-only reference data, public to all logged-in users)
-- ---------------------------------------------------------------------------
create table if not exists public.government_schemes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authority text not null, -- Central / State name
  category text not null, -- subsidy, loan, insurance, law
  benefit_amount text,
  description text not null,
  eligibility text not null,
  official_link text,
  created_at timestamptz default now()
);
alter table public.government_schemes enable row level security;
create policy "anyone signed in can read schemes" on public.government_schemes
  for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 5. INSURANCE POLICIES + CLAIMS
-- ---------------------------------------------------------------------------
create table if not exists public.insurance_policies (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  parcel_id uuid references public.land_parcels(id) on delete set null,
  scheme_name text not null default 'Pradhan Mantri Fasal Bima Yojana',
  crop_name text not null,
  sum_insured numeric not null,
  premium_paid numeric not null,
  policy_number text unique,
  start_date date not null,
  end_date date not null,
  status text default 'active', -- active, expired, claimed
  created_at timestamptz default now()
);
alter table public.insurance_policies enable row level security;
create policy "farmer manages own policies" on public.insurance_policies
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

create table if not exists public.insurance_claims (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.insurance_policies(id) on delete cascade,
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  reason text not null, -- drought, flood, pest, fire, hailstorm, other
  loss_percent numeric not null,
  description text,
  evidence_url text,
  status text default 'submitted', -- submitted, under_review, approved, rejected, paid
  claim_amount numeric,
  submitted_at timestamptz default now()
);
alter table public.insurance_claims enable row level security;
create policy "farmer manages own claims" on public.insurance_claims
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 6. EXPERT VIDEO CONSULTATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.experts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  specialty text not null, -- soil, pest control, horticulture, livestock, agronomy
  years_experience int,
  languages text[],
  avatar_url text,
  rating numeric default 4.5,
  available boolean default true
);
alter table public.experts enable row level security;
create policy "anyone signed in can read experts" on public.experts
  for select using (auth.role() = 'authenticated');

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  expert_id uuid references public.experts(id) on delete set null,
  scheduled_at timestamptz not null,
  room_code text not null, -- used to build the Jitsi room URL
  topic text,
  status text default 'scheduled', -- scheduled, completed, cancelled
  created_at timestamptz default now()
);
alter table public.consultations enable row level security;
create policy "farmer manages own consultations" on public.consultations
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 7. MARKETPLACE — buying inputs (pesticides, seeds, fertilizer, tools)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- pesticide, fertilizer, seed, tool, medicine
  description text,
  price numeric not null,
  unit text not null, -- kg, litre, packet, piece
  stock int default 0,
  image_url text,
  seller_name text default 'Uzhavar Thozhan Store',
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "anyone signed in can read products" on public.products
  for select using (auth.role() = 'authenticated');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity numeric not null,
  total_price numeric not null,
  status text default 'pending', -- pending, confirmed, shipped, delivered, cancelled
  delivery_address text,
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "farmer manages own orders" on public.orders
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 8. SELL PRODUCE — farmer lists harvested produce for buyers (market/govt/private)
-- ---------------------------------------------------------------------------
create table if not exists public.produce_listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  crop_name text not null,
  quantity_kg numeric not null,
  expected_price_per_kg numeric not null,
  quality_grade text default 'A', -- A, B, C
  harvest_date date,
  buyer_type text, -- open_market, government, private_company
  status text default 'listed', -- listed, in_negotiation, sold, expired
  image_url text,
  created_at timestamptz default now()
);
alter table public.produce_listings enable row level security;
create policy "farmer manages own listings" on public.produce_listings
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);
create policy "anyone signed in can browse listings" on public.produce_listings
  for select using (auth.role() = 'authenticated');

create table if not exists public.buyer_offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.produce_listings(id) on delete cascade,
  buyer_name text not null,
  buyer_type text not null, -- government, private_company, individual
  offered_price_per_kg numeric not null,
  message text,
  created_at timestamptz default now()
);
alter table public.buyer_offers enable row level security;
create policy "anyone signed in can read offers" on public.buyer_offers
  for select using (auth.role() = 'authenticated');
create policy "anyone signed in can make offers" on public.buyer_offers
  for insert with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 9. LOANS
-- ---------------------------------------------------------------------------
create table if not exists public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  scheme_id uuid references public.government_schemes(id) on delete set null,
  amount_requested numeric not null,
  purpose text not null, -- seeds, equipment, land_development, general
  status text default 'submitted', -- submitted, under_review, approved, disbursed, rejected
  bank_name text,
  interest_rate numeric,
  submitted_at timestamptz default now()
);
alter table public.loan_applications enable row level security;
create policy "farmer manages own loans" on public.loan_applications
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 10. EQUIPMENT / ROBOT BOOKING
-- ---------------------------------------------------------------------------
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null, -- tractor, drone_sprayer, harvester, tiller, planting_robot
  rate_per_day numeric not null,
  image_url text,
  available boolean default true
);
alter table public.equipment enable row level security;
create policy "anyone signed in can read equipment" on public.equipment
  for select using (auth.role() = 'authenticated');

create table if not exists public.equipment_bookings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  equipment_id uuid references public.equipment(id) on delete set null,
  start_date date not null,
  end_date date not null,
  delivery_address text,
  total_cost numeric,
  status text default 'requested', -- requested, confirmed, in_use, completed, cancelled
  created_at timestamptz default now()
);
alter table public.equipment_bookings enable row level security;
create policy "farmer manages own bookings" on public.equipment_bookings
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 11. COMMUNITY FORUM (bonus feature — farmer-to-farmer Q&A)
-- ---------------------------------------------------------------------------
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category text default 'general',
  created_at timestamptz default now()
);
alter table public.forum_posts enable row level security;
create policy "anyone signed in can read posts" on public.forum_posts
  for select using (auth.role() = 'authenticated');
create policy "farmer manages own posts" on public.forum_posts
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 12. NOTIFICATIONS (bonus — weather alerts, claim/loan status changes)
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info', -- info, weather_alert, claim_update, loan_update, order_update
  read boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "farmer manages own notifications" on public.notifications
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- Auto-create a blank farmer_profile row right after OTP sign-up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.farmer_profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'), coalesce(new.phone, ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Seed data: government schemes, experts, equipment, sample products
-- ---------------------------------------------------------------------------
insert into public.government_schemes (title, authority, category, benefit_amount, description, eligibility, official_link) values
('PM-KISAN', 'Government of India', 'subsidy', '₹6,000/year', 'Direct income support paid in three instalments to landholding farmer families.', 'All landholding farmer families with cultivable land.', 'https://pmkisan.gov.in'),
('Pradhan Mantri Fasal Bima Yojana', 'Government of India', 'insurance', 'Up to full sum insured', 'Crop insurance covering yield losses from natural calamities, pests and disease.', 'Farmers growing notified crops in notified areas.', 'https://pmfby.gov.in'),
('Kisan Credit Card', 'Government of India', 'loan', 'Up to ₹3,00,000 at 4% (with subvention)', 'Short-term credit for crop production, post-harvest expenses and farm assets.', 'Farmers, tenant farmers, sharecroppers, SHGs.', 'https://www.myscheme.gov.in/schemes/kcc'),
('Soil Health Card Scheme', 'Government of India', 'law', 'Free soil testing', 'Provides soil nutrient status and fertiliser recommendations to every farm holding.', 'All farmers; card issued once every 2 years per holding.', 'https://soilhealth.dac.gov.in'),
('Agriculture Infrastructure Fund', 'Government of India', 'loan', 'Loans up to ₹2 crore, 3% interest subvention', 'Medium-long term debt financing for post-harvest and farm-gate infrastructure.', 'Farmers, FPOs, cooperatives, agri-entrepreneurs.', 'https://agriinfra.dac.gov.in'),
('Sub-Mission on Agricultural Mechanization', 'Government of India', 'subsidy', '40-50% subsidy on machinery', 'Subsidised purchase of tractors, tillers, harvesters and custom hiring centres.', 'Individual farmers and custom hiring centres.', 'https://agrimachinery.nic.in')
on conflict do nothing;

insert into public.experts (full_name, specialty, years_experience, languages, rating) values
('Dr. Kalaivani Raman', 'Soil Science', 14, array['Tamil','English'], 4.8),
('Dr. Suresh Pillai', 'Pest & Disease Control', 11, array['Tamil','English','Malayalam'], 4.7),
('Dr. Anitha Devi', 'Horticulture', 9, array['Tamil','English'], 4.9),
('Dr. Muthu Kumar', 'Agronomy & Fertilizers', 17, array['Tamil','English','Telugu'], 4.6)
on conflict do nothing;

insert into public.equipment (name, type, rate_per_day, available) values
('Mahindra 575 Tractor', 'tractor', 1800, true),
('Drone Pesticide Sprayer', 'drone_sprayer', 2500, true),
('Combine Harvester', 'harvester', 4500, true),
('Power Tiller', 'tiller', 900, true),
('Automated Seed Planting Robot', 'planting_robot', 3200, true)
on conflict do nothing;

insert into public.products (name, category, description, price, unit, stock) values
('Neem Oil Organic Pesticide', 'pesticide', 'Cold-pressed neem oil, safe for beneficial insects.', 320, 'litre', 150),
('NPK 19:19:19 Fertilizer', 'fertilizer', 'Balanced water-soluble fertilizer for all growth stages.', 850, 'kg', 200),
('Hybrid Paddy Seeds (ADT-45)', 'seed', 'High-yield, short duration paddy variety.', 180, 'kg', 300),
('Bio Fungicide Trichoderma', 'medicine', 'Controls soil-borne fungal diseases naturally.', 240, 'kg', 100),
('Sprayer Pump Manual 16L', 'tool', 'Hand-operated knapsack sprayer, corrosion resistant.', 1350, 'piece', 40)
on conflict do nothing;

-- ============================================================================
-- v2 additions — soil test history, reviews/wishlist/cart, messaging, CMS,
-- support, audit trail, generic file records, and admin roles.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 13. SOIL REPORTS (dated test history, distinct from the live parcel reading)
-- ---------------------------------------------------------------------------
create table if not exists public.soil_reports (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  parcel_id uuid references public.land_parcels(id) on delete cascade,
  ph numeric, nitrogen numeric, phosphorus numeric, potassium numeric,
  organic_carbon numeric, moisture numeric,
  health_score numeric,
  report_source text default 'self_reported', -- self_reported, lab, soil_health_card
  tested_on date default current_date,
  created_at timestamptz default now()
);
alter table public.soil_reports enable row level security;
create policy "farmer manages own soil reports" on public.soil_reports
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 14. WEATHER LOGS (cache of fetched forecasts, useful for trend charts/alerts)
-- ---------------------------------------------------------------------------
create table if not exists public.weather_logs (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  latitude numeric not null,
  longitude numeric not null,
  temperature numeric,
  humidity numeric,
  rain_probability numeric,
  condition text,
  logged_at timestamptz default now()
);
alter table public.weather_logs enable row level security;
create policy "farmer manages own weather logs" on public.weather_logs
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 15. DISEASE DETECTIONS (photo-based plant diagnosis history)
-- ---------------------------------------------------------------------------
create table if not exists public.disease_detections (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  crop_name text,
  image_url text not null,
  disease_name text,
  confidence numeric,
  treatment text,
  organic_treatment text,
  detected_at timestamptz default now()
);
alter table public.disease_detections enable row level security;
create policy "farmer manages own detections" on public.disease_detections
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 16. REVIEWS, WISHLISTS, CART (marketplace commerce layer)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
alter table public.reviews enable row level security;
create policy "anyone signed in can read reviews" on public.reviews
  for select using (auth.role() = 'authenticated');
create policy "farmer manages own reviews" on public.reviews
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

create table if not exists public.wishlists (
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (farmer_id, product_id)
);
alter table public.wishlists enable row level security;
create policy "farmer manages own wishlist" on public.wishlists
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

create table if not exists public.cart_items (
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity numeric not null default 1,
  updated_at timestamptz default now(),
  primary key (farmer_id, product_id)
);
alter table public.cart_items enable row level security;
create policy "farmer manages own cart" on public.cart_items
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 17. MESSAGES (farmer <-> expert / farmer <-> buyer direct chat)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.farmer_profiles(id) on delete cascade,
  recipient_id uuid references public.farmer_profiles(id) on delete cascade,
  consultation_id uuid references public.consultations(id) on delete set null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
create policy "participants read their messages" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "sender sends messages" on public.messages
  for insert with check (auth.uid() = sender_id);

-- ---------------------------------------------------------------------------
-- 18. BLOGS / CMS (agronomy articles, editable from the admin panel)
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_name text default 'Uzhavar Thozhan Team',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);
alter table public.blogs enable row level security;
create policy "anyone can read published blogs" on public.blogs
  for select using (published = true);

-- ---------------------------------------------------------------------------
-- 19. SUPPORT TICKETS
-- ---------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  subject text not null,
  description text not null,
  category text default 'general', -- general, payment, technical, order, claim
  status text default 'open', -- open, in_progress, resolved, closed
  created_at timestamptz default now()
);
alter table public.support_tickets enable row level security;
create policy "farmer manages own tickets" on public.support_tickets
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 20. FILES (generic pointer table for Supabase Storage uploads: documents,
--     farm photos, prescriptions, certificates, bank proofs, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmer_profiles(id) on delete cascade,
  bucket text not null, -- e.g. 'farm-photos', 'documents', 'prescriptions'
  path text not null,
  file_type text,
  label text,
  created_at timestamptz default now()
);
alter table public.files enable row level security;
create policy "farmer manages own files" on public.files
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ---------------------------------------------------------------------------
-- 21. ADMIN ROLES + AUDIT LOG
-- ---------------------------------------------------------------------------
create table if not exists public.admin_roles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'support', -- support, content, superadmin
  granted_at timestamptz default now()
);
alter table public.admin_roles enable row level security;
create policy "admins read their own role" on public.admin_roles
  for select using (auth.uid() = id);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "admins read audit logs" on public.audit_logs
  for select using (exists (select 1 from public.admin_roles a where a.id = auth.uid()));

-- Helper view an admin dashboard can query directly for top-line stats.
create or replace view public.admin_stats as
select
  (select count(*) from public.farmer_profiles) as total_farmers,
  (select count(*) from public.orders) as total_orders,
  (select count(*) from public.loan_applications where status in ('submitted','under_review')) as pending_loans,
  (select count(*) from public.insurance_claims where status in ('submitted','under_review')) as pending_claims,
  (select count(*) from public.support_tickets where status = 'open') as open_tickets,
  (select count(*) from public.produce_listings where status = 'listed') as active_listings;

-- ---------------------------------------------------------------------------
-- v2: extra registration fields on farmer_profiles (email/password signup,
-- Aadhaar, optional farmer ID, address breakdown, farm size, languages)
-- ---------------------------------------------------------------------------
alter table public.farmer_profiles add column if not exists email text;
alter table public.farmer_profiles add column if not exists aadhaar_number text;
alter table public.farmer_profiles add column if not exists farmer_id_code text;
alter table public.farmer_profiles add column if not exists farm_size_acres numeric;
alter table public.farmer_profiles add column if not exists languages text[] default array['ta'];

-- Aadhaar is sensitive PII — store only if you have a verified legal basis and
-- encrypt/mask in application code; never display it in full in the UI.

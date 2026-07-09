"use client";

import { createBrowserClient } from "@supabase/ssr";

// NEXT_PUBLIC_* values are safe to expose to the browser by design —
// Supabase's anon key is meant to be public and access is controlled by
// Row Level Security policies (see supabase/schema.sql).


const NEXT_PUBLIC_SUPABASE_URL="https://riutgkxgdvqusxjeppbc.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdXRna3hnZHZxdXN4amVwcGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTM1MjcsImV4cCI6MjA5OTAyOTUyN30.9Ys_utjtrVI2lV2GIuyTFaE1tvXO4-SntrFphjt2RZc"

export function createClient() {
  return createBrowserClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

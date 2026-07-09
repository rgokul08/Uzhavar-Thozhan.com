import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Next.js 15 made cookies() async — this helper must be awaited by every caller.

const NEXT_PUBLIC_SUPABASE_URL="https://riutgkxgdvqusxjeppbc.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdXRna3hnZHZxdXN4amVwcGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTM1MjcsImV4cCI6MjA5OTAyOTUyN30.9Ys_utjtrVI2lV2GIuyTFaE1tvXO4-SntrFphjt2RZc"

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a Server Component; middleware handles refresh
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

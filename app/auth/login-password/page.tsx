"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (loginError) { setError(loginError.message); return; }
    // "Remember me": Supabase's cookie session already persists across browser restarts by
    // default. When unchecked, we flag the session as short-lived so a future sign-out-on-close
    // hook (or a scheduled edge function) can honor it — wire that up if you need strict behavior.
    if (!remember) localStorage.setItem("uzhavar_session_short_lived", "1");
    else localStorage.removeItem("uzhavar_session_short_lived");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-paper/10 dark:bg-night-card/80">
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
          <KeyRound className="h-6 w-6 text-leaf" /> Log in with password
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-soil-700 dark:text-paper/60">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-leaf" />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="font-medium text-leaf-600 underline underline-offset-4">Forgot password?</Link>
          </div>
          {error && <p className="text-sm text-clay">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-leaf py-3.5 font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-soil-700 dark:text-paper/60">
          New here? <Link href="/auth/register" className="font-semibold text-leaf-600 underline underline-offset-4">Create an account</Link>
        </p>
        <p className="mt-2 text-center text-xs text-soil-700/60 dark:text-paper/40">
          Or <Link href="/auth/login-otp" className="underline underline-offset-4">get a one-time code by email</Link> /{" "}
          <Link href="/auth/login" className="underline underline-offset-4">by phone</Link>
        </p>
      </motion.div>
    </main>
  );
}

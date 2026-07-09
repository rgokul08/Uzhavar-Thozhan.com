"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined,
    });
    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-paper/10 dark:bg-night-card/80">
        {!sent ? (
          <>
            <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
              <Mail className="h-6 w-6 text-leaf" /> Reset your password
            </div>
            <p className="text-sm text-soil-700 dark:text-paper/60">We'll email you a secure link to set a new password.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
              {error && <p className="text-sm text-clay">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-leaf py-3.5 font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-leaf" />
            <p className="font-display text-lg font-semibold text-soil dark:text-paper">Check your inbox</p>
            <p className="text-sm text-soil-700 dark:text-paper/60">We sent a password reset link to {email}.</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}

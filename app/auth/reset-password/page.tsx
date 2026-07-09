"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-paper/10 dark:bg-night-card/80">
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
          <KeyRound className="h-6 w-6 text-leaf" /> Set a new password
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
          <input required type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-leaf py-3.5 font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60">
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

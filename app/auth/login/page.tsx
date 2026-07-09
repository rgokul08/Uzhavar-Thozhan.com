"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sprout, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const fullPhone = `+91${digits}`;
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    router.push(`/auth/verify?phone=${encodeURIComponent(fullPhone)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil">
          <Sprout className="h-6 w-6 text-leaf" />
          Uzhavar Thozhan
        </div>
        <h1 className="font-display text-2xl font-semibold text-soil">Farmer Login</h1>
        <p className="mt-2 text-sm text-soil-700">
          We&apos;ll text an 8-digit one-time code to verify it&apos;s you. No password needed.
        </p>

        <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-soil-700">
            Mobile number
            <div className="mt-2 flex items-center rounded-xl border border-soil/20 bg-white px-4 py-3 focus-within:border-leaf">
              <Phone className="mr-2 h-4 w-4 text-soil-700/60" />
              <span className="mr-2 font-mono text-sm text-soil-700">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent font-mono text-sm outline-none"
                required
              />
            </div>
          </label>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-leaf py-3.5 font-semibold text-paper transition-colors hover:bg-leaf-600 disabled:opacity-60 focus-ring"
          >
            {loading ? "Sending code…" : "Send OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-soil-700/60">
          By continuing you agree to receive SMS updates about your crops, orders and claims.
        </p>
        <p className="mt-4 text-center text-xs text-soil-700/60">
          Prefer email? <a href="/auth/login-otp" className="underline underline-offset-4">OTP by email</a> ·{" "}
          <a href="/auth/login-password" className="underline underline-offset-4">password login</a> ·{" "}
          <a href="/auth/register" className="underline underline-offset-4">create account</a>
        </p>
      </motion.div>
    </main>
  );
}

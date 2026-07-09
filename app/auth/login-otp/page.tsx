"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const OTP_LENGTH = 8;
const EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN = 60;

export default function EmailOtpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setLoading(false);
    if (otpError) { setError(otpError.message); return; }
    setStep("otp");
    setSecondsLeft(EXPIRY_SECONDS);
    setCooldown(RESEND_COOLDOWN);
    setDigits(Array(OTP_LENGTH).fill(""));
  }

  function updateDigit(i: number, v: string) {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = clean; setDigits(next);
    if (clean && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const token = digits.join("");
    if (token.length !== OTP_LENGTH) { setError(`Enter the full ${OTP_LENGTH}-digit code.`); return; }
    if (secondsLeft === 0) { setError("This code has expired — request a new one."); return; }
    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setLoading(false);
    if (verifyError) { setError(verifyError.message); return; }
    setStep("success");
    setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 1200);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-paper/10 dark:bg-night-card/80">

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
                <Mail className="h-6 w-6 text-leaf" /> Log in with email
              </div>
              <p className="text-sm text-soil-700 dark:text-paper/60">We'll send an 8-digit code to your inbox — it expires in 5 minutes.</p>
              <form onSubmit={sendOtp} className="mt-6 space-y-4">
                <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-soil/20 px-4 py-3 text-sm dark:border-paper/20 dark:bg-night-card" />
                {error && <p className="text-sm text-clay">{error}</p>}
                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf py-3.5 font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Sending…" : "Send OTP"}
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-soil-700/60 dark:text-paper/40">
                Prefer a password? <Link href="/auth/login-password" className="font-semibold text-leaf-600 underline underline-offset-4">Log in with password</Link>
              </p>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil dark:text-paper">
                <ShieldCheck className="h-6 w-6 text-leaf" /> Enter the code
              </div>
              <p className="text-sm text-soil-700 dark:text-paper/60">
                Sent to <span className="font-mono">{email}</span> · expires in <span className="font-mono text-clay">{mm}:{ss}</span>
              </p>
              <form onSubmit={verify} className="mt-6">
                <div className="flex justify-between gap-1.5">
                  {digits.map((d, i) => (
                    <input key={i} ref={(el) => { inputsRef.current[i] = el; }} value={d}
                      onChange={(e) => updateDigit(i, e.target.value)} inputMode="numeric" maxLength={1}
                      className="h-12 w-8 rounded-lg border border-soil/20 text-center font-mono text-lg outline-none focus:border-leaf dark:border-paper/20 dark:bg-night-card sm:w-9" />
                  ))}
                </div>
                {error && <p className="mt-4 text-sm text-clay">{error}</p>}
                <button type="submit" disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf py-3.5 font-semibold text-paper hover:bg-leaf-600 disabled:opacity-60">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Verifying…" : "Verify & continue"}
                </button>
              </form>
              <button onClick={() => cooldown === 0 && sendOtp()} disabled={cooldown > 0}
                className="mt-5 w-full text-center text-sm font-medium text-leaf-600 underline underline-offset-4 disabled:text-soil-700/40 disabled:no-underline">
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-leaf" />
              <p className="font-display text-lg font-semibold text-soil dark:text-paper">Verified — taking you to your dashboard…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

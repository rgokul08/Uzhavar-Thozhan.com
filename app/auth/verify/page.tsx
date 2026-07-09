"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const OTP_LENGTH = 8;

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const supabase = createClient();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const token = digits.join("");
    if (token.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }
    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    setLoading(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function resendCode() {
    setError("");
    await supabase.auth.signInWithOtp({ phone });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md rounded-2xl border border-soil/10 bg-white/80 p-8 shadow-sm backdrop-blur"
    >
      <div className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-soil">
        <ShieldCheck className="h-6 w-6 text-leaf" />
        Verify your number
      </div>
      <p className="text-sm text-soil-700">
        Enter the 8-digit code sent to <span className="font-mono font-medium">{phone || "your phone"}</span>.
      </p>

      <form onSubmit={handleVerify} className="mt-8">
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              value={d}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-12 w-9 rounded-lg border border-soil/20 text-center font-mono text-lg outline-none focus:border-leaf sm:w-10"
            />
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-leaf py-3.5 font-semibold text-paper transition-colors hover:bg-leaf-600 disabled:opacity-60 focus-ring"
        >
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>
      </form>

      <button onClick={resendCode} className="mt-5 w-full text-center text-sm font-medium text-leaf-600 underline underline-offset-4">
        Resend code
      </button>
    </motion.div>
  );
}

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-field-lines px-6">
      <Suspense fallback={null}>
        <VerifyForm />
      </Suspense>
    </main>
  );
}

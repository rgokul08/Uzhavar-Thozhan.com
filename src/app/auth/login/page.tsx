"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, ArrowRight, Phone, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        // Store session
        localStorage.setItem("farmerId", data.farmerId.toString());
        localStorage.setItem("farmerName", data.name);
        router.push("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-leaf p-12 lg:flex">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-paper">
            <Sprout className="h-6 w-6" />
            Uzhavar Thozhan
          </Link>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-paper">
            Welcome back,<br />farmer.
          </h2>
          <p className="mt-4 text-lg text-leaf-100">
            Your crops, weather, schemes and marketplace — all waiting for you.
          </p>
        </div>
        <p className="text-sm text-leaf-200">
          © {new Date().getFullYear()} Uzhavar Thozhan
        </p>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Sprout className="h-6 w-6 text-leaf" />
            <span className="font-bold text-soil">Uzhavar Thozhan</span>
          </div>

          <h1 className="text-3xl font-bold text-soil">Sign in</h1>
          <p className="mt-2 text-soil-600">
            Enter your phone number and password to access your farm dashboard.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                  className="w-full rounded-xl border border-soil/20 bg-white py-3 pl-10 pr-4 text-sm transition-colors focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-soil/20 bg-white py-3 pl-10 pr-4 text-sm transition-colors focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf py-3 font-semibold text-paper transition-colors hover:bg-leaf-600 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-soil-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-leaf hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

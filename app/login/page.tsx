"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow text-clay-dark mb-2">Farmer login</p>
      <h1 className="font-display text-3xl font-semibold mb-6">Welcome back</h1>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        <label className="text-sm font-medium">
          Phone number
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            placeholder="10-digit mobile number"
          />
        </label>
        <label className="text-sm font-medium">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-black/20 rounded px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="bg-paddy text-husk font-semibold rounded py-2 hover:bg-paddy-dark disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-sm mt-4">
        New here?{" "}
        <Link href="/register" className="text-paddy font-semibold">
          Create a farmer account
        </Link>
      </p>
      {/* TODO: add OTP login option for farmers without a set password */}
    </div>
  );
}

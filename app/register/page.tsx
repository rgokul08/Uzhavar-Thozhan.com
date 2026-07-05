"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", phone: "", password: "", village: "", district: "", state: "", pinCode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="eyebrow text-clay-dark mb-2">Join Uzhavar Thozhan</p>
      <h1 className="font-display text-3xl font-semibold mb-6">Create your farmer account</h1>
      <form onSubmit={handleSubmit} className="card grid sm:grid-cols-2 gap-4">
        <label className="text-sm font-medium sm:col-span-2">
          Full name
          <input required className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Phone number
          <input required type="tel" className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Password
          <input required type="password" className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.password} onChange={(e) => update("password", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          Village
          <input className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.village} onChange={(e) => update("village", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          District
          <input className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.district} onChange={(e) => update("district", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          State
          <input className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.state} onChange={(e) => update("state", e.target.value)} />
        </label>
        <label className="text-sm font-medium">
          PIN code
          <input className="mt-1 w-full border border-black/20 rounded px-3 py-2"
            value={form.pinCode} onChange={(e) => update("pinCode", e.target.value)} />
        </label>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <button disabled={loading}
          className="sm:col-span-2 bg-turmeric text-ink font-semibold rounded py-2 hover:bg-turmeric-dark hover:text-husk disabled:opacity-60">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, ArrowRight, User, Phone, Lock, MapPin, Wheat } from "lucide-react";

const soilTypes = ["Alluvial", "Black/Regur", "Red", "Laterite", "Sandy", "Clay", "Loamy", "Other"];
const states = ["Tamil Nadu", "Andhra Pradesh", "Karnataka", "Kerala", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Haryana", "Rajasthan", "Gujarat", "West Bengal", "Bihar", "Odisha", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "",
    village: "", district: "", state: "Tamil Nadu", landSize: "", soilType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
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
    <div className="min-h-screen bg-soil-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-soil">
          <Sprout className="h-6 w-6 text-leaf" />
          Uzhavar Thozhan
        </Link>

        <div className="rounded-2xl border border-soil/10 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-soil">Create your farm account</h1>
          <p className="mt-2 text-sm text-soil-600">
            Register once and access all 15+ farming services for free.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Personal info */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-soil-500">
                <User className="h-4 w-4" /> Personal Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" />
                </div>
              </div>
            </div>

            {/* Phone & Password */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-soil-500">
                <Phone className="h-4 w-4" /> Login Credentials
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    placeholder="10-digit number" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-400" />
                    <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                      className="w-full rounded-xl border border-soil/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Confirm Password *</label>
                  <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-soil-500">
                <MapPin className="h-4 w-4" /> Farm Location
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Village</label>
                  <input type="text" value={form.village} onChange={(e) => update("village", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">District</label>
                  <input type="text" value={form.district} onChange={(e) => update("district", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">State</label>
                  <select value={form.state} onChange={(e) => update("state", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20">
                    {states.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Farm details */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-soil-500">
                <Wheat className="h-4 w-4" /> Farm Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Land Size (acres)</label>
                  <input type="number" step="0.01" value={form.landSize} onChange={(e) => update("landSize", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-soil-700">Soil Type</label>
                  <select value={form.soilType} onChange={(e) => update("soilType", e.target.value)}
                    className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20">
                    <option value="">Select soil type</option>
                    {soilTypes.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf py-3 font-semibold text-paper transition-colors hover:bg-leaf-600 disabled:opacity-50">
              {loading ? "Creating account..." : "Create Farm Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-soil-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-leaf hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Store, Plus, Package, IndianRupee, CheckCircle2 } from "lucide-react";

interface Listing {
  id: number;
  cropName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  description: string | null;
  status: string | null;
  createdAt: string;
}

export default function SellPage() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [form, setForm] = useState({ cropName: "", quantity: "", unit: "quintal", pricePerUnit: "", description: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/produce").then(r => r.json()).then(d => setListings(d.listings || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setListings(prev => [data.listing, ...prev]);
        setMessage("✅ Produce listed successfully! Buyers can now see your listing.");
        setShowForm(false);
        setForm({ cropName: "", quantity: "", unit: "quintal", pricePerUnit: "", description: "" });
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Sell Your Produce</h1>
          <p className="mt-1 text-soil-600">List your harvest directly. No middlemen, 0% commission.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
          <Plus className="h-4 w-4" /> New Listing
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-leaf/20 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">List Your Produce</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Crop Name</label>
              <input type="text" value={form.cropName} onChange={(e) => setForm({...form, cropName: e.target.value})}
                placeholder="e.g. Rice, Tomato" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Quantity</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})}
                  placeholder="100" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Unit</label>
                <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})}
                  className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none">
                  <option>quintal</option><option>kg</option><option>ton</option><option>bag</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Price per Unit (₹)</label>
              <input type="number" value={form.pricePerUnit} onChange={(e) => setForm({...form, pricePerUnit: e.target.value})}
                placeholder="2500" className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                placeholder="Organic, freshly harvested..." className="w-full rounded-xl border border-soil/20 py-2.5 px-4 text-sm focus:border-leaf focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-xl bg-leaf px-6 py-2.5 text-sm font-semibold text-paper hover:bg-leaf-600">
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing listings */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <div key={l.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-soil">{l.cropName}</h3>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                l.status === "sold" ? "bg-blue-100 text-blue-700" : "bg-leaf-100 text-leaf-700"
              }`}>
                {l.status || "available"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-soil-600">
              <span>{l.quantity} {l.unit}</span>
              <span className="flex items-center gap-0.5 font-semibold text-soil">
                <IndianRupee className="h-3.5 w-3.5" />{l.pricePerUnit}/{l.unit}
              </span>
            </div>
            {l.description && <p className="mt-2 text-xs text-soil-500">{l.description}</p>}
          </div>
        ))}
        {listings.length === 0 && (
          <div className="col-span-full rounded-2xl border border-soil/10 bg-white p-12 text-center">
            <Store className="mx-auto h-12 w-12 text-soil-300" />
            <p className="mt-4 text-soil-500">No produce listed yet. Click &ldquo;New Listing&rdquo; to start selling.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Store, Landmark, Building2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Listing {
  id: string; crop_name: string; quantity_kg: number; expected_price_per_kg: number;
  quality_grade: string; buyer_type: string; status: string;
}

const buyerIcon: Record<string, any> = { open_market: Store, government: Landmark, private_company: Building2 };

export default function SellPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<Listing[]>([]);
  const [form, setForm] = useState({ crop_name: "", quantity_kg: "", expected_price_per_kg: "", quality_grade: "A", buyer_type: "open_market" });
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data } = await supabase.from("produce_listings").select("*").order("created_at", { ascending: false });
    setListings((data as Listing[]) ?? []);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleList(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("produce_listings").insert({
      farmer_id: user.id,
      crop_name: form.crop_name,
      quantity_kg: Number(form.quantity_kg),
      expected_price_per_kg: Number(form.expected_price_per_kg),
      quality_grade: form.quality_grade,
      buyer_type: form.buyer_type,
    });
    setShowForm(false);
    setForm({ crop_name: "", quantity_kg: "", expected_price_per_kg: "", quality_grade: "A", buyer_type: "open_market" });
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Sell produce"
        title="Sell directly — open market, private buyers or government"
        description="List your harvest once; buyers of every kind can see and make offers on it."
      />

      <button onClick={() => setShowForm(!showForm)} className="mb-6 rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-paper">
        + List produce for sale
      </button>

      {showForm && (
        <form onSubmit={handleList} className="mb-8 grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 sm:grid-cols-3">
          <input required placeholder="Crop name" value={form.crop_name}
            onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input required type="number" placeholder="Quantity (kg)" value={form.quantity_kg}
            onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input required type="number" placeholder="Expected price / kg (₹)" value={form.expected_price_per_kg}
            onChange={(e) => setForm({ ...form, expected_price_per_kg: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <select value={form.quality_grade} onChange={(e) => setForm({ ...form, quality_grade: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm">
            <option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option>
          </select>
          <select value={form.buyer_type} onChange={(e) => setForm({ ...form, buyer_type: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm">
            <option value="open_market">Open market</option>
            <option value="government">Government procurement</option>
            <option value="private_company">Private company</option>
          </select>
          <button type="submit" className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-paper">Publish listing</button>
        </form>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => {
          const Icon = buyerIcon[l.buyer_type] ?? User;
          return (
            <div key={l.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-soil">{l.crop_name}</h3>
                <span className="rounded-full bg-leaf-200/50 px-2 py-0.5 text-[11px] font-medium text-leaf-600">Grade {l.quality_grade}</span>
              </div>
              <p className="mt-2 text-sm text-soil-700">{l.quantity_kg} kg · ₹{l.expected_price_per_kg}/kg</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs capitalize text-soil-700/70">
                <Icon className="h-3.5 w-3.5" /> {l.buyer_type.replace("_", " ")}
              </div>
              <span className="mt-3 inline-block rounded-full bg-sky-200/60 px-2.5 py-0.5 text-[11px] font-medium capitalize text-sky">{l.status.replace("_", " ")}</span>
            </div>
          );
        })}
        {listings.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-soil/20 p-8 text-center text-sm text-soil-700">No produce listed yet.</p>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Policy {
  id: string; scheme_name: string; crop_name: string; sum_insured: number;
  premium_paid: number; policy_number: string; start_date: string; end_date: string; status: string;
}

export default function InsurancePage() {
  const supabase = createClient();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ crop_name: "", sum_insured: "", area_acres: "" });

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("insurance_policies").select("*").eq("farmer_id", user.id).order("created_at", { ascending: false });
    setPolicies((data as Policy[]) ?? []);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const sumInsured = Number(form.sum_insured);
    const premium = Math.round(sumInsured * 0.02); // 2% farmer share, illustrative of PMFBY rates
    const policyNumber = `PMFBY-${Date.now().toString().slice(-8)}`;
    await supabase.from("insurance_policies").insert({
      farmer_id: user.id,
      crop_name: form.crop_name,
      sum_insured: sumInsured,
      premium_paid: premium,
      policy_number: policyNumber,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
    });
    setShowForm(false);
    setForm({ crop_name: "", sum_insured: "", area_acres: "" });
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Insurance"
        title="Protect your crop against loss"
        description="Buy PMFBY-style crop insurance and track every policy from one place."
      />

      <button onClick={() => setShowForm(!showForm)} className="mb-6 rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-paper">
        + Buy new policy
      </button>

      {showForm && (
        <form onSubmit={handleBuy} className="mb-8 grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 sm:grid-cols-3">
          <input required placeholder="Crop name" value={form.crop_name}
            onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input required type="number" placeholder="Sum insured (₹)" value={form.sum_insured}
            onChange={(e) => setForm({ ...form, sum_insured: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <button type="submit" className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-paper">
            Confirm & pay premium
          </button>
          <p className="text-xs text-soil-700/60 sm:col-span-3">Farmer premium share is estimated at 2% of sum insured, in line with PMFBY kharif food-crop rates.</p>
        </form>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {policies.map((p) => (
          <div key={p.id} className="rounded-2xl border border-soil/10 bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-semibold text-soil">
                <ShieldCheck className="h-5 w-5 text-leaf" /> {p.crop_name}
              </div>
              <span className="rounded-full bg-leaf-200/50 px-2.5 py-0.5 text-[11px] font-medium capitalize text-leaf-600">{p.status}</span>
            </div>
            <p className="mt-1 font-mono text-xs text-soil-700/60">{p.policy_number}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-soil-700/50">Sum insured</p><p className="font-mono font-medium">₹{p.sum_insured.toLocaleString("en-IN")}</p></div>
              <div><p className="text-soil-700/50">Premium paid</p><p className="font-mono font-medium">₹{p.premium_paid.toLocaleString("en-IN")}</p></div>
              <div><p className="text-soil-700/50">Valid from</p><p className="font-mono">{p.start_date}</p></div>
              <div><p className="text-soil-700/50">Valid till</p><p className="font-mono">{p.end_date}</p></div>
            </div>
            <Link href={`/dashboard/insurance/claim?policy=${p.id}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-leaf-600 underline underline-offset-4">
              <FileText className="h-4 w-4" /> File a claim on this policy
            </Link>
          </div>
        ))}
        {policies.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-soil/20 p-8 text-center text-sm text-soil-700">
            No policies yet — buy one to protect your next harvest.
          </p>
        )}
      </div>
    </div>
  );
}

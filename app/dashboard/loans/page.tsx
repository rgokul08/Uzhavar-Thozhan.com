"use client";

import { useEffect, useState } from "react";
import { HandCoins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Loan {
  id: string; amount_requested: number; purpose: string; status: string; submitted_at: string;
}

const purposes = ["seeds", "equipment", "land_development", "general"];
const statusStyle: Record<string, string> = {
  submitted: "bg-sky-200/60 text-sky",
  under_review: "bg-turmeric-300/40 text-turmeric-500",
  approved: "bg-leaf-200/50 text-leaf-600",
  disbursed: "bg-leaf-200/50 text-leaf-600",
  rejected: "bg-clay/10 text-clay",
};

export default function LoansPage() {
  const supabase = createClient();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [form, setForm] = useState({ amount_requested: "", purpose: "seeds", bank_name: "" });

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("loan_applications").select("*").eq("farmer_id", user.id).order("submitted_at", { ascending: false });
    setLoans((data as Loan[]) ?? []);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("loan_applications").insert({
      farmer_id: user.id,
      amount_requested: Number(form.amount_requested),
      purpose: form.purpose,
      bank_name: form.bank_name || "Kisan Credit Card — Nationalised Bank",
      interest_rate: 4,
    });
    setForm({ amount_requested: "", purpose: "seeds", bank_name: "" });
    load();
  }

  return (
    <div>
      <PageHeader eyebrow="Farm loans" title="Apply for a Kisan Credit Card loan" description="Short-term credit at subsidised interest, for seeds, equipment or land development." />

      <form onSubmit={handleApply} className="mb-10 grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 sm:grid-cols-3">
        <input required type="number" placeholder="Amount requested (₹)" value={form.amount_requested}
          onChange={(e) => setForm({ ...form, amount_requested: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
        <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm capitalize">
          {purposes.map((p) => <option key={p} value={p}>{p.replace("_", " ")}</option>)}
        </select>
        <input placeholder="Preferred bank (optional)" value={form.bank_name}
          onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
        <button type="submit" className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-paper sm:col-span-3">
          Submit application
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {loans.map((l) => (
          <div key={l.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-semibold text-soil">
                <HandCoins className="h-5 w-5 text-leaf" /> ₹{l.amount_requested.toLocaleString("en-IN")}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusStyle[l.status] ?? ""}`}>{l.status.replace("_", " ")}</span>
            </div>
            <p className="mt-2 text-sm capitalize text-soil-700">Purpose: {l.purpose.replace("_", " ")}</p>
            <p className="mt-1 font-mono text-xs text-soil-700/60">Applied {new Date(l.submitted_at).toLocaleDateString("en-IN")}</p>
          </div>
        ))}
        {loans.length === 0 && <p className="col-span-full text-sm text-soil-700">No loan applications yet.</p>}
      </div>
    </div>
  );
}

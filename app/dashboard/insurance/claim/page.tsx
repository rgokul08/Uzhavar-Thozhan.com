"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";

interface Claim {
  id: string; reason: string; loss_percent: number; status: string; submitted_at: string; claim_amount: number | null;
}

const reasons = ["drought", "flood", "pest_attack", "fire", "hailstorm", "other"];

const statusStyle: Record<string, string> = {
  submitted: "bg-sky-200/60 text-sky",
  under_review: "bg-turmeric-300/40 text-turmeric-500",
  approved: "bg-leaf-200/50 text-leaf-600",
  paid: "bg-leaf-200/50 text-leaf-600",
  rejected: "bg-clay/10 text-clay",
};

function ClaimForm() {
  const supabase = createClient();
  const params = useSearchParams();
  const policyId = params.get("policy") ?? "";
  const [claims, setClaims] = useState<Claim[]>([]);
  const [form, setForm] = useState({ reason: "drought", loss_percent: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("insurance_claims").select("*").eq("farmer_id", user.id).order("submitted_at", { ascending: false });
    setClaims((data as Claim[]) ?? []);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!policyId) return;
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("insurance_claims").insert({
        policy_id: policyId,
        farmer_id: user.id,
        reason: form.reason,
        loss_percent: Number(form.loss_percent),
        description: form.description,
      });
      await supabase.from("insurance_policies").update({ status: "claimed" }).eq("id", policyId);
    }
    setSubmitting(false);
    setForm({ reason: "drought", loss_percent: "", description: "" });
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Insurance claim"
        title="Report a crop loss"
        description="Tell us what happened — our team cross-checks it against weather and satellite data before approval."
      />

      {!policyId && <p className="mb-6 text-sm text-clay">Open this page from a specific policy on the Insurance tab to file a claim.</p>}

      <form onSubmit={handleSubmit} className="mb-10 grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 sm:grid-cols-2">
        <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm capitalize">
          {reasons.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
        </select>
        <input required type="number" min="1" max="100" placeholder="Estimated loss (%)" value={form.loss_percent}
          onChange={(e) => setForm({ ...form, loss_percent: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
        <textarea placeholder="Describe what happened" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm sm:col-span-2" rows={3} />
        <button type="submit" disabled={submitting || !policyId}
          className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-50 sm:col-span-2">
          {submitting ? "Submitting…" : "Submit claim"}
        </button>
      </form>

      <h2 className="mb-4 font-display text-lg font-semibold text-soil">Your claims</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {claims.map((c) => (
          <div key={c.id} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium capitalize text-soil">{c.reason.replace("_", " ")}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusStyle[c.status] ?? ""}`}>{c.status.replace("_", " ")}</span>
            </div>
            <p className="mt-2 text-sm text-soil-700">Loss estimate: {c.loss_percent}%</p>
            <p className="mt-1 font-mono text-xs text-soil-700/60">Filed {new Date(c.submitted_at).toLocaleDateString("en-IN")}</p>
            {c.claim_amount && <p className="mt-2 font-mono text-sm font-semibold text-leaf-600">Payout: ₹{c.claim_amount.toLocaleString("en-IN")}</p>}
          </div>
        ))}
        {claims.length === 0 && <p className="text-sm text-soil-700">No claims filed yet.</p>}
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return <Suspense fallback={null}><ClaimForm /></Suspense>;
}

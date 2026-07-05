"use client";

import { useEffect, useState } from "react";
import { Banknote } from "lucide-react";

export default function LoansPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applied, setApplied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/loans").then((r) => r.json()).then((d) => setSchemes(d.schemes || []));
  }, []);

  async function apply(schemeId: string, maxAmount: number) {
    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmerId: "TODO", schemeId, amountRequested: maxAmount })
    });
    const data = await res.json();
    setApplied(data.loan?.id || null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 11</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Farm loans</h1>
      <p className="text-ink/70 mb-8">Government and bank loan schemes for seeds, equipment, and land improvement.</p>

      {applied && (
        <div className="card mb-6 border-turmeric">
          <p className="font-semibold">Application submitted.</p>
          <p className="text-sm text-ink/70">Track its status from your dashboard.</p>
        </div>
      )}

      {schemes.length === 0 && <p className="text-ink/70">No loan schemes loaded yet. Populate <code>LoanScheme</code>.</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        {schemes.map((s) => (
          <div key={s.id} className="card">
            <Banknote className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{s.name}</h3>
            <p className="text-sm text-clay-dark">{s.provider}</p>
            <p className="text-sm font-mono mt-2">Up to ₹{s.maxAmount.toLocaleString("en-IN")} · {s.interestRate}% interest</p>
            <p className="text-xs text-ink/60">Tenure: {s.tenureMonths} months</p>
            <button onClick={() => apply(s.id, s.maxAmount)} className="mt-3 bg-paddy text-husk text-sm font-semibold rounded px-4 py-2">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

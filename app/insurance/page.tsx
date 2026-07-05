"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function InsurancePage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/insurance").then((r) => r.json()).then((d) => setPlans(d.plans || []));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 06</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Crop insurance</h1>
      <p className="text-ink/70 mb-8">
        Insure a season&apos;s harvest against drought, flood, or pest loss.{" "}
        <Link href="/insurance/claim" className="text-paddy font-semibold">Already insured? File a claim →</Link>
      </p>

      {plans.length === 0 && (
        <p className="text-ink/70">
          No plans loaded yet. Populate <code>InsurancePlan</code> in the database, or connect
          a scheme like PMFBY.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <ShieldCheck className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-ink/70">{p.coverage}</p>
            <p className="text-sm font-mono mt-2">Premium: {p.premiumRate}% of sum insured</p>
            <button className="mt-3 bg-paddy text-husk text-sm font-semibold rounded px-4 py-2">
              Get covered
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

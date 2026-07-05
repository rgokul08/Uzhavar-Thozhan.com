"use client";

import { useState } from "react";

export default function ClaimPage() {
  const [reason, setReason] = useState("Flood");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // NOTE: farmerId/insuranceId should come from the logged-in session
    // and the farmer's active policy — wire this up once auth context exists.
    await fetch("/api/insurance/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmerId: "TODO", insuranceId: "TODO", reason, description, photoUrls: [] })
    });
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 07</p>
      <h1 className="font-display text-3xl font-semibold mb-2">File an insurance claim</h1>
      <p className="text-ink/70 mb-8">Describe the damage and attach photos — we&apos;ll route it for review.</p>

      {submitted ? (
        <div className="card">
          <p className="font-semibold">Claim submitted.</p>
          <p className="text-sm text-ink/70 mt-1">You&apos;ll be notified as it moves through review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <label className="text-sm font-medium">
            Reason
            <select value={reason} onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full border border-black/20 rounded px-3 py-2">
              <option>Flood</option>
              <option>Drought</option>
              <option>Pest attack</option>
              <option>Disease</option>
              <option>Other</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            What happened?
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)}
              rows={5} className="mt-1 w-full border border-black/20 rounded px-3 py-2" />
          </label>
          <label className="text-sm font-medium">
            Photos of the damage
            <input type="file" multiple accept="image/*" className="mt-1 block" />
            {/* TODO: upload to STORAGE_BUCKET and pass resulting URLs as photoUrls */}
          </label>
          <button className="bg-paddy text-husk font-semibold rounded py-2">Submit claim</button>
        </form>
      )}
    </div>
  );
}

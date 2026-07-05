"use client";

import { useState } from "react";

export default function SellPage() {
  const [form, setForm] = useState({ produceName: "", quantityKg: "", pricePerKg: "", buyerType: "individual" });
  const [done, setDone] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmerId: "TODO", // from session
        produceName: form.produceName,
        quantityKg: Number(form.quantityKg),
        pricePerKg: Number(form.pricePerKg),
        buyerType: form.buyerType
      })
    });
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 10</p>
      <h1 className="font-display text-3xl font-semibold mb-6">List your produce</h1>

      {done ? (
        <div className="card"><p className="font-semibold">Listing published.</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <label className="text-sm font-medium">
            Produce
            <input required value={form.produceName} onChange={(e) => update("produceName", e.target.value)}
              className="mt-1 w-full border border-black/20 rounded px-3 py-2" placeholder="e.g. Paddy, Tomato, Sugarcane" />
          </label>
          <label className="text-sm font-medium">
            Quantity (kg)
            <input required type="number" value={form.quantityKg} onChange={(e) => update("quantityKg", e.target.value)}
              className="mt-1 w-full border border-black/20 rounded px-3 py-2" />
          </label>
          <label className="text-sm font-medium">
            Price per kg (₹)
            <input required type="number" value={form.pricePerKg} onChange={(e) => update("pricePerKg", e.target.value)}
              className="mt-1 w-full border border-black/20 rounded px-3 py-2" />
          </label>
          <label className="text-sm font-medium">
            Open to
            <select value={form.buyerType} onChange={(e) => update("buyerType", e.target.value)}
              className="mt-1 w-full border border-black/20 rounded px-3 py-2">
              <option value="individual">Individual buyers</option>
              <option value="private_company">Private companies</option>
              <option value="government">Government procurement</option>
            </select>
          </label>
          <button className="bg-paddy text-husk font-semibold rounded py-2">Publish listing</button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/marketplace").then((r) => r.json()).then((d) => setListings(d.listings || []));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 10</p>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-semibold">Sell direct to buyers</h1>
        <Link href="/marketplace/sell" className="bg-turmeric text-ink text-sm font-semibold rounded px-4 py-2">
          List my produce
        </Link>
      </div>
      <p className="text-ink/70 mb-8">
        List your harvest for individuals, private companies, or government procurement —
        no middleman commission.
      </p>

      {listings.length === 0 && <p className="text-ink/70">No listings yet.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((l) => (
          <div key={l.id} className="card">
            <Store className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{l.produceName}</h3>
            <p className="text-sm text-ink/70">{l.quantityKg} kg available</p>
            <p className="font-mono mt-1">₹{l.pricePerKg} / kg</p>
            {l.buyerType && <p className="text-xs text-clay-dark mt-1 capitalize">Open to: {l.buyerType}</p>}
            <button className="mt-3 bg-paddy text-husk text-sm font-semibold rounded px-4 py-2">Contact farmer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

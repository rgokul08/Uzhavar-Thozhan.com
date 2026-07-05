"use client";

import { useEffect, useState } from "react";
import { Tractor } from "lucide-react";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [booked, setBooked] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/equipment").then((r) => r.json()).then((d) => setEquipment(d.equipment || []));
  }, []);

  async function book(equipmentId: string, dailyRate: number) {
    const start = new Date();
    const end = new Date(Date.now() + 86400000);
    const res = await fetch("/api/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmerId: "TODO",
        equipmentId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalCost: dailyRate
      })
    });
    const data = await res.json();
    setBooked(data.booking?.id || null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 12</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Book equipment &amp; robots</h1>
      <p className="text-ink/70 mb-8">Reserve drones, tillers, and harvesting robots by the day.</p>

      {booked && (
        <div className="card mb-6 border-turmeric">
          <p className="font-semibold">Booking requested.</p>
          <p className="text-sm text-ink/70">You&apos;ll get confirmation once the operator accepts.</p>
        </div>
      )}

      {equipment.length === 0 && <p className="text-ink/70">No equipment listed yet. Populate <code>Equipment</code>.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipment.map((e) => (
          <div key={e.id} className="card">
            <Tractor className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{e.name}</h3>
            <p className="text-xs text-clay-dark capitalize">{e.type}</p>
            <p className="font-mono mt-2">₹{e.dailyRate} / day</p>
            <button onClick={() => book(e.id, e.dailyRate)} className="mt-3 bg-paddy text-husk text-sm font-semibold rounded px-4 py-2">
              Book now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

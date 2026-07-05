"use client";

import { useEffect, useState } from "react";
import { Video, Star } from "lucide-react";

export default function ConsultPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [booked, setBooked] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/consult").then((r) => r.json()).then((d) => setExperts(d.experts || []));
  }, []);

  async function book(expertId: string) {
    // NOTE: farmerId + real scheduling UI (date/time picker) still needed.
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmerId: "TODO", expertId, scheduledAt: new Date().toISOString() })
    });
    const data = await res.json();
    setBooked(data.consultation?.id || null);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 08</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Ask a plant doctor</h1>
      <p className="text-ink/70 mb-8">Book a video call with an expert for pest, disease, or soil questions.</p>

      {booked && (
        <div className="card mb-6 border-turmeric">
          <p className="font-semibold">Consultation booked.</p>
          <p className="text-sm text-ink/70">You&apos;ll get a video call link before your slot.</p>
        </div>
      )}

      {experts.length === 0 && (
        <p className="text-ink/70">No experts loaded yet. Populate <code>ExpertDoctor</code> in the database.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {experts.map((e) => (
          <div key={e.id} className="card">
            <Video className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{e.name}</h3>
            <p className="text-sm text-clay-dark">{e.specialty}</p>
            <p className="text-xs text-ink/60 mt-1">Speaks: {(e.languages || []).join(", ")}</p>
            <p className="text-sm flex items-center gap-1 mt-1"><Star size={14} className="text-turmeric" /> {e.rating}</p>
            <button onClick={() => book(e.id)} className="mt-3 bg-paddy text-husk text-sm font-semibold rounded px-4 py-2">
              Book video call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

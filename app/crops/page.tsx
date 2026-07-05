"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";

const soilTypes = ["Red loam", "Black cotton", "Alluvial", "Sandy", "Clay"];
const seasons = ["Kharif", "Rabi", "Zaid"];

export default function CropsPage() {
  const [soilType, setSoilType] = useState(soilTypes[0]);
  const [season, setSeason] = useState(seasons[0]);
  const [ph, setPh] = useState("6.5");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function findCrops(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/crops/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soilType, season, ph })
      });
      const data = await res.json();
      setResults(data.crops || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 02</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Match crops to your land</h1>
      <p className="text-ink/70 mb-8">
        Tell us your soil type and the current season — we&apos;ll suggest crops with the
        right nutrient and water fit, and note the fertilizer/chemical program each needs.
      </p>

      <form onSubmit={findCrops} className="card grid sm:grid-cols-3 gap-4 mb-8">
        <label className="text-sm font-medium">
          Soil type
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)}
            className="mt-1 w-full border border-black/20 rounded px-3 py-2">
            {soilTypes.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Season
          <select value={season} onChange={(e) => setSeason(e.target.value)}
            className="mt-1 w-full border border-black/20 rounded px-3 py-2">
            {seasons.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Soil pH (optional)
          <input value={ph} onChange={(e) => setPh(e.target.value)}
            className="mt-1 w-full border border-black/20 rounded px-3 py-2" />
        </label>
        <button disabled={loading} className="sm:col-span-3 bg-paddy text-husk font-semibold rounded py-2">
          {loading ? "Matching…" : "Find crops"}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p className="text-ink/70">
          No crops in the database yet match &quot;{soilType}&quot; for {season}. Seed the
          <code className="mx-1">Crop</code> table via Prisma Studio or the admin panel.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {results.map((c) => (
          <div key={c.id} className="card">
            <Sprout className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{c.name} {c.tamilName ? `· ${c.tamilName}` : ""}</h3>
            <p className="text-sm text-ink/70">Water: {c.waterRequirement || "—"}</p>
            <p className="text-sm text-ink/70">Fertilizer notes: {c.fertilizerNotes || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

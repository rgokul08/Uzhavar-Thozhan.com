"use client";

import { useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";

export default function WeatherPage() {
  const [pinCode, setPinCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?pinCode=${encodeURIComponent(pinCode)}`);
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 04</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Weather for your fields</h1>
      <p className="text-ink/70 mb-8">Enter your PIN code for a 3-day forecast and any active alerts.</p>

      <form onSubmit={search} className="flex gap-3 mb-8">
        <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="e.g. 636001"
          className="flex-1 border border-black/20 rounded px-3 py-2" />
        <button disabled={loading} className="bg-paddy text-husk font-semibold rounded px-5">
          {loading ? "Checking…" : "Check weather"}
        </button>
      </form>

      {data && (
        <div className="space-y-6">
          <div className="card flex items-center gap-6">
            <CloudSun size={40} className="text-paddy" />
            <div>
              <p className="font-mono text-3xl">{data.current.tempC}°C</p>
              <p className="text-sm text-ink/70">{data.current.condition}</p>
            </div>
            <div className="ml-auto flex gap-6 text-sm">
              <span className="flex items-center gap-1"><Droplets size={16} /> {data.current.humidity}%</span>
              <span className="flex items-center gap-1"><Wind size={16} /> {data.current.windKph} kph</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.forecast.map((f: any) => (
              <div key={f.day} className="card text-center">
                <p className="font-semibold">{f.day}</p>
                <p className="font-mono">{f.high}° / {f.low}°</p>
                <p className="text-xs text-ink/60">{f.rainChance}% rain</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

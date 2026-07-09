"use client";

import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { FlaskConical } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Reading { ph: number; n: number; p: number; k: number; organicCarbon: number; moisture: number; }

// Scores each reading 0-100 against agronomically healthy ranges for most field crops.
function scoreReading(r: Reading) {
  const score = (value: number, low: number, high: number) => {
    if (value < low) return Math.max(0, 100 - ((low - value) / low) * 100);
    if (value > high) return Math.max(0, 100 - ((value - high) / high) * 100);
    return 100;
  };
  return {
    ph: score(r.ph, 6, 7.5),
    n: score(r.n, 280, 560),      // kg/ha, medium-high range
    p: score(r.p, 10, 25),        // kg/ha
    k: score(r.k, 120, 280),      // kg/ha
    organicCarbon: score(r.organicCarbon, 0.5, 0.75), // %
    moisture: score(r.moisture, 20, 60), // %
  };
}

function adviceFor(scores: ReturnType<typeof scoreReading>, r: Reading) {
  const notes: string[] = [];
  if (scores.ph < 70) notes.push(r.ph < 6 ? "Soil is acidic — apply agricultural lime to raise pH toward 6.5." : "Soil is alkaline — apply gypsum or organic matter to bring pH down.");
  if (scores.n < 70) notes.push("Nitrogen is low — split-apply urea or use a legume cover crop to fix nitrogen naturally.");
  if (scores.p < 70) notes.push("Phosphorus is low — apply single super phosphate (SSP) or rock phosphate before sowing.");
  if (scores.k < 70) notes.push("Potassium is low — apply muriate of potash (MOP), especially before flowering/tuberisation.");
  if (scores.organicCarbon < 70) notes.push("Organic carbon is low — add farmyard manure, compost or green manure to rebuild soil structure.");
  if (scores.moisture < 70) notes.push(r.moisture < 20 ? "Soil moisture is low — plan irrigation before the next sowing window." : "Soil moisture is high — ensure drainage to avoid root rot.");
  if (notes.length === 0) notes.push("All readings are in a healthy range — maintain your current fertilisation and irrigation schedule.");
  return notes;
}

export default function SoilAnalysisPage() {
  const [form, setForm] = useState({ ph: "6.5", n: "300", p: "15", k: "180", organicCarbon: "0.6", moisture: "35" });
  const [result, setResult] = useState<{ scores: ReturnType<typeof scoreReading>; overall: number; notes: string[] } | null>(null);

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const r: Reading = {
      ph: Number(form.ph), n: Number(form.n), p: Number(form.p),
      k: Number(form.k), organicCarbon: Number(form.organicCarbon), moisture: Number(form.moisture),
    };
    const scores = scoreReading(r);
    const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
    setResult({ scores, overall, notes: adviceFor(scores, r) });
  }

  const chartData = result ? [
    { metric: "pH", value: Math.round(result.scores.ph) },
    { metric: "Nitrogen", value: Math.round(result.scores.n) },
    { metric: "Phosphorus", value: Math.round(result.scores.p) },
    { metric: "Potassium", value: Math.round(result.scores.k) },
    { metric: "Organic C", value: Math.round(result.scores.organicCarbon) },
    { metric: "Moisture", value: Math.round(result.scores.moisture) },
  ] : [];

  return (
    <div>
      <PageHeader eyebrow="Soil analysis" title="Turn a soil test into a health score" description="Enter your soil test card readings for an instant health score and fertiliser advice." />

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleAnalyze} className="grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 dark:border-paper/10 dark:bg-night-card/50 sm:grid-cols-2">
          <Field label="Soil pH" value={form.ph} onChange={(v) => setForm({ ...form, ph: v })} />
          <Field label="Nitrogen (kg/ha)" value={form.n} onChange={(v) => setForm({ ...form, n: v })} />
          <Field label="Phosphorus (kg/ha)" value={form.p} onChange={(v) => setForm({ ...form, p: v })} />
          <Field label="Potassium (kg/ha)" value={form.k} onChange={(v) => setForm({ ...form, k: v })} />
          <Field label="Organic carbon (%)" value={form.organicCarbon} onChange={(v) => setForm({ ...form, organicCarbon: v })} />
          <Field label="Moisture (%)" value={form.moisture} onChange={(v) => setForm({ ...form, moisture: v })} />
          <button type="submit" className="mt-2 rounded-lg bg-leaf py-2.5 text-sm font-semibold text-paper sm:col-span-2">
            Generate health score
          </button>
        </form>

        {result && (
          <div className="rounded-2xl border border-soil/10 bg-white/70 p-6 dark:border-paper/10 dark:bg-night-card/50">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-6 w-6 text-leaf" />
              <div>
                <p className="text-xs text-soil-700/60 dark:text-paper/50">Overall soil health</p>
                <p className="font-display text-3xl font-semibold text-leaf-600">{result.overall}<span className="text-base text-soil-700/50">/100</span></p>
              </div>
            </div>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} outerRadius={90}>
                  <PolarGrid stroke="#2F6B3C33" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#4A3420" }} />
                  <Radar dataKey="value" stroke="#2F6B3C" fill="#2F6B3C" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2 text-sm text-soil-700 dark:text-paper/70">
              {result.notes.map((n, i) => <li key={i} className="flex gap-2"><span className="text-leaf">•</span>{n}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm text-soil-700 dark:text-paper/60">
      {label}
      <input type="number" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-soil/20 px-4 py-2.5 text-sm dark:border-paper/20 dark:bg-night-card" />
    </label>
  );
}

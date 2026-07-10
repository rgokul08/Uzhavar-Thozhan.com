"use client";

import { useState } from "react";
import { FlaskConical, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

function computeHealthScore(n: number, p: number, k: number, ph: number, oc: number) {
  let score = 0;
  // Nitrogen (ideal 240-480 kg/ha)
  if (n >= 240 && n <= 480) score += 25;
  else if (n >= 120 && n < 240) score += 15;
  else if (n > 480) score += 18;
  else score += 8;
  // Phosphorus (ideal 25-50 kg/ha)
  if (p >= 25 && p <= 50) score += 25;
  else if (p >= 10 && p < 25) score += 15;
  else if (p > 50) score += 18;
  else score += 8;
  // Potassium (ideal 250-500 kg/ha)
  if (k >= 250 && k <= 500) score += 25;
  else if (k >= 110 && k < 250) score += 15;
  else if (k > 500) score += 18;
  else score += 8;
  // pH (ideal 6.0-7.5)
  if (ph >= 6.0 && ph <= 7.5) score += 15;
  else if (ph >= 5.5 && ph < 6.0) score += 10;
  else if (ph > 7.5 && ph <= 8.5) score += 10;
  else score += 5;
  // Organic carbon (ideal > 0.75%)
  if (oc >= 0.75) score += 10;
  else if (oc >= 0.5) score += 6;
  else score += 3;

  return Math.min(100, score);
}

function getAdvice(n: number, p: number, k: number, ph: number, oc: number) {
  const tips: string[] = [];
  if (n < 240) tips.push("🔴 Nitrogen is low. Apply Urea (46-0-0) at 50-100 kg/ha or incorporate green manure crops like Dhaincha.");
  else if (n > 480) tips.push("🟡 Nitrogen is high. Reduce urea application. Consider growing legumes to balance.");
  else tips.push("🟢 Nitrogen levels are optimal.");

  if (p < 25) tips.push("🔴 Phosphorus is low. Apply DAP (18-46-0) or Single Super Phosphate at 60-80 kg/ha.");
  else if (p > 50) tips.push("🟡 Phosphorus is high. Skip phosphatic fertilizer this season.");
  else tips.push("🟢 Phosphorus levels are adequate.");

  if (k < 250) tips.push("🔴 Potassium is low. Apply Muriate of Potash (MOP) at 40-60 kg/ha.");
  else if (k > 500) tips.push("🟡 Potassium is high. Reduce MOP application.");
  else tips.push("🟢 Potassium levels are good.");

  if (ph < 6.0) tips.push("🔴 Soil is acidic. Apply lime (CaCO₃) at 2-4 quintal/ha to raise pH.");
  else if (ph > 7.5) tips.push("🔴 Soil is alkaline. Apply gypsum at 2-5 quintal/ha or use sulphur-coated fertilizers.");
  else tips.push("🟢 pH is in the optimal range for most crops.");

  if (oc < 0.5) tips.push("🔴 Organic carbon is very low. Incorporate Farm Yard Manure (FYM) at 10-15 t/ha and practice crop residue recycling.");
  else if (oc < 0.75) tips.push("🟡 Organic carbon is moderate. Add compost or vermicompost to improve.");
  else tips.push("🟢 Organic carbon is healthy.");

  return tips;
}

export default function SoilPage() {
  const [form, setForm] = useState({ n: "", p: "", k: "", ph: "", oc: "" });
  const [result, setResult] = useState<{ score: number; advice: string[] } | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const n = parseFloat(form.n), p = parseFloat(form.p), k = parseFloat(form.k);
    const ph = parseFloat(form.ph), oc = parseFloat(form.oc);

    const score = computeHealthScore(n, p, k, ph, oc);
    const advice = getAdvice(n, p, k, ph, oc);
    setResult({ score, advice });

    // Save to DB
    setSaving(true);
    try {
      await fetch("/api/soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nitrogen: n, phosphorus: p, potassium: k, ph, organicCarbon: oc, healthScore: score, advice: advice.join("\n") }),
      });
    } catch { /* ignore */ }
    setSaving(false);
  }

  const scoreColor = result
    ? result.score >= 70 ? "text-leaf" : result.score >= 40 ? "text-turmeric" : "text-clay"
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Soil Health Analysis</h1>
        <p className="mt-1 text-soil-600">
          Enter your soil test card readings to get an instant health score and fertilizer plan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input form */}
        <div className="rounded-2xl border border-soil/5 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-soil">
            <FlaskConical className="h-5 w-5 text-amber-600" />
            Enter Soil Test Values
          </h2>
          <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Nitrogen (kg/ha)</label>
                <input type="number" step="0.01" value={form.n} onChange={(e) => update("n", e.target.value)}
                  placeholder="e.g. 280" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Phosphorus (kg/ha)</label>
                <input type="number" step="0.01" value={form.p} onChange={(e) => update("p", e.target.value)}
                  placeholder="e.g. 35" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">Potassium (kg/ha)</label>
                <input type="number" step="0.01" value={form.k} onChange={(e) => update("k", e.target.value)}
                  placeholder="e.g. 310" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-soil-700">pH Level</label>
                <input type="number" step="0.01" value={form.ph} onChange={(e) => update("ph", e.target.value)}
                  placeholder="e.g. 6.8" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-soil-700">Organic Carbon (%)</label>
              <input type="number" step="0.01" value={form.oc} onChange={(e) => update("oc", e.target.value)}
                placeholder="e.g. 0.65" className="w-full rounded-xl border border-soil/20 bg-white py-2.5 px-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20" required />
            </div>
            <button type="submit" disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf py-3 font-semibold text-paper transition-colors hover:bg-leaf-600 disabled:opacity-50">
              {saving ? "Analyzing..." : "Analyze Soil Health"}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-soil/5 bg-white p-6">
          <h2 className="text-lg font-semibold text-soil">Analysis Results</h2>
          {result ? (
            <div className="mt-4 space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border-8 border-soil-100">
                  <div className={`text-4xl font-bold ${scoreColor}`}>
                    {result.score}
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-soil-600">
                  Soil Health Score (out of 100)
                </p>
                <p className={`text-sm font-semibold ${scoreColor}`}>
                  {result.score >= 70 ? "Healthy Soil" : result.score >= 40 ? "Needs Improvement" : "Poor Health"}
                </p>
              </div>

              {/* Advice */}
              <div className="space-y-3">
                <h3 className="font-semibold text-soil">Fertilizer Recommendations</h3>
                {result.advice.map((tip, i) => (
                  <div key={i} className="flex gap-2 rounded-lg bg-soil-50 p-3 text-sm text-soil-700">
                    {tip.startsWith("🟢") ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-turmeric" />
                    )}
                    <span>{tip.substring(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-12 text-center">
              <FlaskConical className="mx-auto h-16 w-16 text-soil-200" />
              <p className="mt-4 text-soil-400">
                Enter your soil test values and click &ldquo;Analyze&rdquo; to see results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

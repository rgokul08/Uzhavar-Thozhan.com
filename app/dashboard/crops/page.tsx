"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/PageHeader";
import { CROPS_BY_SOIL, SOIL_LABELS, SoilType } from "@/lib/data/crops";

interface Parcel {
  id: string;
  name: string;
  area_acres: number;
  soil_type: SoilType;
  nitrogen_ppm: number | null;
  phosphorus_ppm: number | null;
  potassium_ppm: number | null;
  ph_level: number | null;
}

export default function CropsPage() {
  const supabase = createClient();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Parcel | null>(null);
  const [form, setForm] = useState({
    name: "", area_acres: "", soil_type: "alluvial" as SoilType,
    nitrogen_ppm: "", phosphorus_ppm: "", potassium_ppm: "", ph_level: "",
  });

  async function loadParcels() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("land_parcels").select("*").eq("farmer_id", user.id).order("created_at", { ascending: false });
    setParcels((data as Parcel[]) ?? []);
    setSelected((data?.[0] as Parcel) ?? null);
    setLoading(false);
  }

  useEffect(() => { loadParcels(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAddParcel(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("land_parcels").insert({
      farmer_id: user.id,
      name: form.name,
      area_acres: Number(form.area_acres),
      soil_type: form.soil_type,
      nitrogen_ppm: form.nitrogen_ppm ? Number(form.nitrogen_ppm) : null,
      phosphorus_ppm: form.phosphorus_ppm ? Number(form.phosphorus_ppm) : null,
      potassium_ppm: form.potassium_ppm ? Number(form.potassium_ppm) : null,
      ph_level: form.ph_level ? Number(form.ph_level) : null,
    });
    setShowForm(false);
    setForm({ name: "", area_acres: "", soil_type: "alluvial", nitrogen_ppm: "", phosphorus_ppm: "", potassium_ppm: "", ph_level: "" });
    loadParcels();
  }

  async function handlePlant(cropName: string, season: string) {
    if (!selected) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("crop_plantings").insert({
      farmer_id: user.id, parcel_id: selected.id, crop_name: cropName, season,
    });
    alert(`${cropName} logged as planted on ${selected.name}.`);
  }

  const recommendations = selected ? CROPS_BY_SOIL[selected.soil_type] : [];

  return (
    <div>
      <PageHeader
        eyebrow="Crop planning"
        title="Plant the right crop for your land"
        description="Add your land parcel's soil type and chemical readings — we'll match crops suited to it."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {parcels.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected?.id === p.id ? "bg-leaf text-paper" : "bg-white/70 text-soil-700 border border-soil/10"
            }`}
          >
            {p.name} · {SOIL_LABELS[p.soil_type]}
          </button>
        ))}
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-leaf/50 px-4 py-2 text-sm font-medium text-leaf-600"
        >
          <Plus className="h-4 w-4" /> Add land parcel
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleAddParcel}
          className="mb-10 grid gap-4 rounded-2xl border border-soil/10 bg-white/70 p-6 sm:grid-cols-2"
        >
          <input required placeholder="Parcel name (e.g. North field)" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input required type="number" step="0.1" placeholder="Area (acres)" value={form.area_acres}
            onChange={(e) => setForm({ ...form, area_acres: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <select value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value as SoilType })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm">
            {Object.entries(SOIL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input type="number" step="0.1" placeholder="Soil pH (optional)" value={form.ph_level}
            onChange={(e) => setForm({ ...form, ph_level: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Nitrogen ppm (optional)" value={form.nitrogen_ppm}
            onChange={(e) => setForm({ ...form, nitrogen_ppm: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Phosphorus ppm (optional)" value={form.phosphorus_ppm}
            onChange={(e) => setForm({ ...form, phosphorus_ppm: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <input type="number" placeholder="Potassium ppm (optional)" value={form.potassium_ppm}
            onChange={(e) => setForm({ ...form, potassium_ppm: e.target.value })}
            className="rounded-lg border border-soil/20 px-4 py-2.5 text-sm" />
          <button type="submit" className="rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-paper sm:col-span-2">
            Save land parcel
          </button>
        </motion.form>
      )}

      {loading && <p className="text-sm text-soil-700">Loading your land…</p>}

      {!loading && selected && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-soil">
            <Sprout className="h-5 w-5 text-leaf" /> Recommended for {SOIL_LABELS[selected.soil_type]}
            {selected.ph_level ? ` · pH ${selected.ph_level}` : ""}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((r) => (
              <div key={r.crop} className="rounded-2xl border border-soil/10 bg-white/70 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-soil">{r.crop}</h3>
                  <span className="rounded-full bg-leaf-200/50 px-2.5 py-0.5 font-mono text-[11px] uppercase text-leaf-600">{r.season}</span>
                </div>
                <p className="mt-2 text-sm text-soil-700">{r.notes}</p>
                <dl className="mt-3 grid grid-cols-4 gap-2 font-mono text-[11px] text-soil-700">
                  <div><dt className="text-soil-700/50">pH</dt><dd>{r.idealPh[0]}–{r.idealPh[1]}</dd></div>
                  <div><dt className="text-soil-700/50">N</dt><dd className="capitalize">{r.n}</dd></div>
                  <div><dt className="text-soil-700/50">P</dt><dd className="capitalize">{r.p}</dd></div>
                  <div><dt className="text-soil-700/50">K</dt><dd className="capitalize">{r.k}</dd></div>
                </dl>
                <button
                  onClick={() => handlePlant(r.crop, r.season)}
                  className="mt-4 w-full rounded-lg bg-leaf py-2 text-sm font-semibold text-paper hover:bg-leaf-600"
                >
                  Log as planted here
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !selected && (
        <p className="rounded-2xl border border-dashed border-soil/20 p-8 text-center text-sm text-soil-700">
          Add your first land parcel to see crop recommendations.
        </p>
      )}
    </div>
  );
}

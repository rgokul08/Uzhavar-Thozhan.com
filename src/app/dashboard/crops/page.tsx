"use client";

import { useState } from "react";
import { Sprout, Search, Leaf, Droplets, Sun, ThermometerSun } from "lucide-react";

const cropDatabase = [
  { name: "Rice (Ponni)", soilTypes: ["Alluvial", "Clay", "Loamy"], season: "Kharif", water: "High", temp: "20-35°C", duration: "120-150 days", npk: "120-60-60 kg/ha" },
  { name: "Wheat", soilTypes: ["Alluvial", "Loamy", "Clay"], season: "Rabi", water: "Medium", temp: "15-25°C", duration: "110-130 days", npk: "120-60-40 kg/ha" },
  { name: "Cotton", soilTypes: ["Black/Regur", "Alluvial"], season: "Kharif", water: "Medium", temp: "25-35°C", duration: "150-180 days", npk: "80-40-40 kg/ha" },
  { name: "Sugarcane", soilTypes: ["Alluvial", "Loamy", "Red"], season: "Kharif", water: "High", temp: "20-35°C", duration: "270-365 days", npk: "250-100-120 kg/ha" },
  { name: "Tomato", soilTypes: ["Loamy", "Sandy", "Red"], season: "Rabi/Zaid", water: "Medium", temp: "20-30°C", duration: "60-90 days", npk: "100-60-60 kg/ha" },
  { name: "Onion", soilTypes: ["Loamy", "Sandy", "Alluvial"], season: "Rabi", water: "Low", temp: "15-25°C", duration: "90-120 days", npk: "80-40-60 kg/ha" },
  { name: "Turmeric", soilTypes: ["Loamy", "Clay", "Red"], season: "Kharif", water: "Medium", temp: "25-35°C", duration: "210-270 days", npk: "60-30-120 kg/ha" },
  { name: "Groundnut", soilTypes: ["Sandy", "Red", "Laterite"], season: "Kharif/Rabi", water: "Low", temp: "25-30°C", duration: "100-130 days", npk: "20-40-40 kg/ha" },
  { name: "Banana", soilTypes: ["Loamy", "Alluvial", "Clay"], season: "Year-round", water: "High", temp: "25-35°C", duration: "300-365 days", npk: "200-60-300 kg/ha" },
  { name: "Maize", soilTypes: ["Loamy", "Alluvial", "Sandy"], season: "Kharif/Rabi", water: "Medium", temp: "20-30°C", duration: "90-120 days", npk: "120-60-40 kg/ha" },
  { name: "Chilli", soilTypes: ["Loamy", "Sandy", "Black/Regur"], season: "Kharif/Rabi", water: "Medium", temp: "20-30°C", duration: "120-150 days", npk: "100-50-50 kg/ha" },
  { name: "Coconut", soilTypes: ["Sandy", "Laterite", "Red"], season: "Year-round", water: "Medium", temp: "25-35°C", duration: "Perennial", npk: "170-34-340 kg/ha" },
];

const soilTypes = ["All", "Alluvial", "Black/Regur", "Red", "Laterite", "Sandy", "Clay", "Loamy"];
const seasons = ["All", "Kharif", "Rabi", "Zaid", "Year-round"];

export default function CropsPage() {
  const [soilFilter, setSoilFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = cropDatabase.filter((c) => {
    if (soilFilter !== "All" && !c.soilTypes.includes(soilFilter)) return false;
    if (seasonFilter !== "All" && !c.season.includes(seasonFilter)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Crop Planning by Soil</h1>
        <p className="mt-1 text-soil-600">
          Find the best crops for your soil type, season, and climate conditions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops..."
            className="w-full rounded-xl border border-soil/20 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/20"
          />
        </div>
        <select value={soilFilter} onChange={(e) => setSoilFilter(e.target.value)}
          className="rounded-xl border border-soil/20 bg-white px-4 py-2.5 text-sm focus:border-leaf focus:outline-none">
          {soilTypes.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}
          className="rounded-xl border border-soil/20 bg-white px-4 py-2.5 text-sm focus:border-leaf focus:outline-none">
          {seasons.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Crop cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((crop) => (
          <div key={crop.name} className="card-hover rounded-2xl border border-soil/5 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-soil">{crop.name}</h3>
                <p className="text-xs text-soil-500">{crop.season}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-soil-600">
                <Leaf className="h-3.5 w-3.5 text-leaf" />
                <span>Soil: {crop.soilTypes.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-soil-600">
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                <span>Water: {crop.water}</span>
              </div>
              <div className="flex items-center gap-2 text-soil-600">
                <ThermometerSun className="h-3.5 w-3.5 text-orange-500" />
                <span>Temp: {crop.temp}</span>
              </div>
              <div className="flex items-center gap-2 text-soil-600">
                <Sun className="h-3.5 w-3.5 text-turmeric" />
                <span>Duration: {crop.duration}</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-leaf-50 p-3">
              <p className="text-xs font-medium text-leaf-700">
                Recommended NPK: {crop.npk}
              </p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-soil/10 bg-white p-12 text-center">
          <Sprout className="mx-auto h-12 w-12 text-soil-300" />
          <p className="mt-4 text-soil-500">No crops match your filters. Try adjusting the criteria.</p>
        </div>
      )}
    </div>
  );
}

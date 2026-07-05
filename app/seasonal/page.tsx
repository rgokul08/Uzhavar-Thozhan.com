import { CalendarDays } from "lucide-react";

// TODO: derive "current season" from real date + region logic (Tamil
// calendar vs Kharif/Rabi vs local agro-climatic zone) instead of the
// static list below, and pull suggested crops from the Crop table.
const seasons = [
  { name: "Kaar (Jun–Jul)", focus: "Nursery raising", crops: ["Paddy nursery", "Green gram"] },
  { name: "Kaanni (Aug–Sep)", focus: "Transplanting", crops: ["Paddy", "Groundnut"] },
  { name: "Mun Pani (Oct–Nov)", focus: "Post-monsoon sowing", crops: ["Black gram", "Sesame"] },
  { name: "Pin Pani (Dec–Jan)", focus: "Harvest & storage", crops: ["Sugarcane", "Cotton harvest"] },
  { name: "Ilavenil (Feb–Mar)", focus: "Summer vegetables", crops: ["Tomato", "Brinjal", "Millets"] },
  { name: "Mudhuvenil (Apr–May)", focus: "Land preparation", crops: ["Fallow / green manure"] }
];

export default function SeasonalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Feature 05</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Seasonal planting guide</h1>
      <p className="text-ink/70 mb-8">The Tamil agricultural calendar, and what to plant in each period.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {seasons.map((s) => (
          <div key={s.name} className="card">
            <CalendarDays className="text-paddy mb-2" />
            <h3 className="font-display text-lg font-semibold">{s.name}</h3>
            <p className="text-sm text-clay-dark font-medium">{s.focus}</p>
            <ul className="text-sm text-ink/70 mt-2 list-disc list-inside">
              {s.crops.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

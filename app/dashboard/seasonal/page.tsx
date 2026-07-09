import PageHeader from "@/components/PageHeader";
import { SEASONAL_CALENDAR } from "@/lib/data/crops";

const seasonLabels = { kharif: "Kharif Season", rabi: "Rabi Season", zaid: "Zaid Season" } as const;

export default function SeasonalPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Seasonal guide"
        title="What to sow, and when"
        description="India's three cropping seasons — plan sowing around the right rainfall and temperature window."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {(Object.keys(SEASONAL_CALENDAR) as (keyof typeof SEASONAL_CALENDAR)[]).map((key) => {
          const s = SEASONAL_CALENDAR[key];
          return (
            <div key={key} className="rounded-2xl border border-soil/10 bg-white/70 p-6">
              <h2 className="font-display text-xl font-semibold text-soil">{seasonLabels[key]}</h2>
              <p className="mt-1 font-mono text-xs text-leaf-600">{s.months}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.crops.map((c) => (
                  <span key={c} className="rounded-full bg-leaf-200/50 px-3 py-1 text-xs font-medium text-leaf-600">{c}</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-soil-700">{s.tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

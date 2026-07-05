import Link from "next/link";
import {
  Sprout,
  Landmark,
  CloudSun,
  CalendarDays,
  ShieldCheck,
  FileWarning,
  Video,
  ShoppingBasket,
  Store,
  Banknote,
  Tractor,
  Wheat,
  User
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  { icon: User, title: "Farmer Login", description: "One account for your land, orders, claims and consultations.", href: "/login" },
  { icon: Sprout, title: "Crop Match", description: "Recommended crops for your soil type and nutrient levels.", href: "/crops" },
  { icon: Landmark, title: "Govt. Schemes", description: "Subsidies, law changes and payouts you may be eligible for.", href: "/schemes" },
  { icon: CloudSun, title: "Weather", description: "Local forecast and alerts for your fields, by pin code.", href: "/weather" },
  { icon: CalendarDays, title: "Season Guide", description: "What to sow this season, based on the Tamil agricultural calendar.", href: "/seasonal" },
  { icon: ShieldCheck, title: "Crop Insurance", description: "Compare plans and insure a season's harvest in minutes.", href: "/insurance" },
  { icon: FileWarning, title: "Claim Insurance", description: "Report crop damage and track your claim to payout.", href: "/insurance/claim" },
  { icon: Video, title: "Ask a Doctor", description: "Video call a plant pathologist about pests or disease.", href: "/consult" },
  { icon: ShoppingBasket, title: "Inputs Store", description: "Pesticides, fertilizer and medicines delivered to your village.", href: "/seeds" },
  { icon: Store, title: "Sell Produce", description: "List your harvest for buyers, private companies or government.", href: "/marketplace" },
  { icon: Banknote, title: "Farm Loans", description: "Apply for government and bank loan schemes.", href: "/loans" },
  { icon: Tractor, title: "Book Equipment", description: "Reserve drones, tillers and harvesting robots by the day.", href: "/equipment" },
  { icon: Wheat, title: "Buy Seeds", description: "Certified seed varieties suited to your season and soil.", href: "/seeds" }
];

const seasons = [
  { name: "Kaar", months: "Jun–Jul", crop: "Nursery raising" },
  { name: "Kaanni", months: "Aug–Sep", crop: "Paddy transplanting" },
  { name: "Mun Pani", months: "Oct–Nov", crop: "Pulses, oilseeds" },
  { name: "Pin Pani", months: "Dec–Jan", crop: "Harvest & storage" },
  { name: "Ilavenil", months: "Feb–Mar", crop: "Vegetables, millets" },
  { name: "Mudhuvenil", months: "Apr–May", crop: "Land preparation" }
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-paddy text-husk">
        <div className="mx-auto max-w-7xl px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-turmeric mb-3">உழவர் தோழன் · Farmer&apos;s Companion</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
              Every tool a farmer needs, from soil to sale, in one place.
            </h1>
            <p className="mt-4 text-husk/80 max-w-xl">
              Match crops to your land, insure your season, reach a plant doctor by video,
              sell straight to buyers, and apply for the loan or subsidy you qualify for —
              without visiting a dozen offices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="bg-turmeric text-ink font-semibold px-6 py-3 rounded hover:bg-turmeric-dark hover:text-husk transition-colors">
                Create your farmer account
              </Link>
              <Link href="/crops" className="border border-husk/40 px-6 py-3 rounded hover:bg-husk/10 transition-colors">
                Find crops for my soil
              </Link>
            </div>
          </div>

          {/* Signature element: the six-season almanac wheel */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 rounded-full border-2 border-turmeric/60" />
              {seasons.map((s, i) => {
                const angle = (360 / seasons.length) * i - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 42; // percent radius for label position
                const x = 50 + r * Math.cos(rad);
                const y = 50 + r * Math.sin(rad);
                return (
                  <div
                    key={s.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center w-24"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <p className="font-display text-turmeric text-sm font-semibold">{s.name}</p>
                    <p className="font-mono text-[10px] text-husk/70">{s.months}</p>
                    <p className="text-[11px] text-husk/90">{s.crop}</p>
                  </div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="eyebrow text-turmeric">Tamil</p>
                  <p className="font-display text-lg">Season Wheel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid — all 13 capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <p className="eyebrow text-clay-dark mb-2">What&apos;s inside</p>
        <h2 className="font-display text-3xl font-semibold mb-8">Thirteen jobs, one login</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              index={String(i + 1).padStart(2, "0")}
              title={f.title}
              description={f.description}
              href={f.href}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

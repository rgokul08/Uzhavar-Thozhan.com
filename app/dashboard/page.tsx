import Link from "next/link";
import { Sprout, ShieldCheck, Banknote, Video, Store, Tractor } from "lucide-react";

// TODO: read the `session` cookie (see lib/auth.ts -> verifySession),
// load the farmer + their lands/orders/claims from prisma, and replace
// the placeholder data below with real records.

const summary = [
  { icon: Sprout, label: "Active crop plans", value: "—" },
  { icon: ShieldCheck, label: "Active insurance policies", value: "—" },
  { icon: Banknote, label: "Loan applications", value: "—" },
  { icon: Video, label: "Upcoming consultations", value: "—" },
  { icon: Store, label: "Live marketplace listings", value: "—" },
  { icon: Tractor, label: "Equipment bookings", value: "—" }
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="eyebrow text-clay-dark mb-2">Your farm</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {summary.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <s.icon className="text-paddy" size={28} />
            <div>
              <p className="text-2xl font-semibold font-mono">{s.value}</p>
              <p className="text-sm text-ink/70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/crops" className="bg-paddy text-husk px-4 py-2 rounded text-sm font-semibold">Add a land / get crop match</Link>
        <Link href="/insurance" className="border border-paddy px-4 py-2 rounded text-sm font-semibold text-paddy">Insure a crop</Link>
        <Link href="/consult" className="border border-paddy px-4 py-2 rounded text-sm font-semibold text-paddy">Talk to an expert</Link>
      </div>
    </div>
  );
}

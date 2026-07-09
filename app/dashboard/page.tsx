import Link from "next/link";
import {
  Sprout, CloudSun, Landmark, ShieldCheck, Video, ShoppingBag,
  Store, HandCoins, Tractor, CalendarRange, Users, Bot, FlaskConical,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

const quickLinks = [
  { href: "/dashboard/assistant", label: "Ask AI Assistant", icon: Bot, color: "bg-turmeric-300/40 text-turmeric-500" },
  { href: "/dashboard/crops", label: "Plan a Crop", icon: Sprout, color: "bg-leaf-200/50 text-leaf-600" },
  { href: "/dashboard/soil", label: "Soil Analysis", icon: FlaskConical, color: "bg-sky-200/60 text-sky" },
  { href: "/dashboard/weather", label: "Check Weather", icon: CloudSun, color: "bg-sky-200/60 text-sky" },
  { href: "/dashboard/seasonal", label: "Seasonal Guide", icon: CalendarRange, color: "bg-turmeric-300/40 text-turmeric-500" },
  { href: "/dashboard/schemes", label: "Govt Schemes", icon: Landmark, color: "bg-leaf-200/50 text-leaf-600" },
  { href: "/dashboard/insurance", label: "Insurance", icon: ShieldCheck, color: "bg-sky-200/60 text-sky" },
  { href: "/dashboard/experts", label: "Talk to Expert", icon: Video, color: "bg-turmeric-300/40 text-turmeric-500" },
  { href: "/dashboard/marketplace", label: "Buy Inputs", icon: ShoppingBag, color: "bg-leaf-200/50 text-leaf-600" },
  { href: "/dashboard/sell", label: "Sell Produce", icon: Store, color: "bg-sky-200/60 text-sky" },
  { href: "/dashboard/loans", label: "Apply for Loan", icon: HandCoins, color: "bg-turmeric-300/40 text-turmeric-500" },
  { href: "/dashboard/equipment", label: "Book Equipment", icon: Tractor, color: "bg-leaf-200/50 text-leaf-600" },
  { href: "/dashboard/community", label: "Community", icon: Users, color: "bg-sky-200/60 text-sky" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("farmer_profiles").select("*").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Vanakkam${profile?.full_name ? ", " + profile.full_name : ""} 🌾`}
        description="Everything you need for today's farm decisions, in one screen."
      />

      {!profile?.soil_type && (
        <div className="mb-8 rounded-2xl border border-turmeric/30 bg-turmeric-300/20 p-5">
          <p className="text-sm font-medium text-soil">
            Complete your land details to unlock personalised crop recommendations.
          </p>
          <Link href="/dashboard/crops" className="mt-2 inline-block text-sm font-semibold text-leaf-600 underline underline-offset-4">
            Add your land parcel →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex flex-col items-start gap-3 rounded-2xl border border-soil/10 bg-white/60 p-5 transition-colors hover:border-leaf/40 hover:bg-white"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${q.color}`}>
              <q.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-soil">{q.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

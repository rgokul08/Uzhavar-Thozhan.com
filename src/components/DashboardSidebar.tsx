"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, Sprout, CloudSun, CalendarRange, Landmark, ShieldCheck,
  Video, ShoppingBag, Store, HandCoins, Tractor, Users, LogOut, Bot, FlaskConical,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/crops", label: "Crop Planning", icon: Sprout },
  { href: "/dashboard/soil", label: "Soil Analysis", icon: FlaskConical },
  { href: "/dashboard/seasonal", label: "Seasonal Guide", icon: CalendarRange },
  { href: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { href: "/dashboard/schemes", label: "Govt Schemes", icon: Landmark },
  { href: "/dashboard/insurance", label: "Insurance", icon: ShieldCheck },
  { href: "/dashboard/experts", label: "Plant Doctors", icon: Video },
  { href: "/dashboard/marketplace", label: "Buy Inputs", icon: ShoppingBag },
  { href: "/dashboard/sell", label: "Sell Produce", icon: Store },
  { href: "/dashboard/loans", label: "Loans", icon: HandCoins },
  { href: "/dashboard/equipment", label: "Book Equipment", icon: Tractor },
  { href: "/dashboard/community", label: "Community", icon: Users },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    router.push("/");
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-soil/10 bg-white/60 md:flex">
      <div className="border-b border-soil/10 px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-soil">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf text-paper">
            <Sprout className="h-4 w-4" />
          </div>
          <span>Uzhavar <span className="text-leaf">Thozhan</span></span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-leaf text-paper shadow-sm"
                  : "text-soil-600 hover:bg-leaf-50 hover:text-leaf-700"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-soil/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-clay hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

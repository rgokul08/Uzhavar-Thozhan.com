"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Bell, Search, Sprout,
  LayoutGrid, Bot, CloudSun, CalendarRange, Landmark, ShieldCheck,
  Video, ShoppingBag, Store, HandCoins, Tractor, Users, LogOut, FlaskConical,
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

export default function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    router.push("/");
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-soil/10 bg-white/80 px-4 py-3 backdrop-blur md:px-6">
        <button onClick={() => setMobileOpen(true)} className="md:hidden">
          <Menu className="h-5 w-5 text-soil" />
        </button>
        <div className="hidden items-center gap-2 rounded-xl border border-soil/10 bg-soil-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-soil-400" />
          <input
            type="text"
            placeholder="Search features..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-soil-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-lg p-2 text-soil-500 hover:bg-soil-50">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-clay" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-sm font-bold text-paper">
            F
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-white">
            <div className="flex items-center justify-between border-b border-soil/10 px-5 py-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-soil">
                <Sprout className="h-5 w-5 text-leaf" />
                Uzhavar Thozhan
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {nav.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                      active ? "bg-leaf text-paper" : "text-soil-600 hover:bg-leaf-50"
                    }`}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-soil/10 p-3">
              <button onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-clay hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

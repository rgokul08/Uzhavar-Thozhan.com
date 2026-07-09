"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sprout } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/assistant", label: "AI Assistant" },
  { href: "/dashboard/crops", label: "Crop Planning" },
  { href: "/dashboard/soil", label: "Soil Analysis" },
  { href: "/dashboard/seasonal", label: "Seasonal Guide" },
  { href: "/dashboard/weather", label: "Weather" },
  { href: "/dashboard/schemes", label: "Govt Schemes" },
  { href: "/dashboard/insurance", label: "Insurance" },
  { href: "/dashboard/experts", label: "Plant Doctors" },
  { href: "/dashboard/marketplace", label: "Buy Inputs" },
  { href: "/dashboard/sell", label: "Sell Produce" },
  { href: "/dashboard/loans", label: "Loans" },
  { href: "/dashboard/equipment", label: "Book Equipment" },
  { href: "/dashboard/community", label: "Community" },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between border-b border-soil/10 bg-white/70 px-5 py-3 md:hidden">
      <div className="flex items-center gap-2 font-display text-base font-semibold">
        <Sprout className="h-5 w-5 text-leaf" />
        Uzhavar Thozhan
      </div>
      <select
        value={pathname}
        onChange={(e) => router.push(e.target.value)}
        className="rounded-lg border border-soil/20 bg-white px-3 py-1.5 text-sm focus-ring"
      >
        {nav.map((n) => (
          <option key={n.href} value={n.href}>{n.label}</option>
        ))}
      </select>
    </div>
  );
}

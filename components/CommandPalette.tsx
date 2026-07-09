"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Sprout, CloudSun, Landmark, ShieldCheck, Video, ShoppingBag, Store,
  HandCoins, Tractor, CalendarRange, Users, LayoutGrid, Bot, Search,
} from "lucide-react";

const destinations = [
  { group: "Navigate", href: "/dashboard", label: "Dashboard overview", icon: LayoutGrid },
  { group: "Navigate", href: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { group: "Grow", href: "/dashboard/crops", label: "Crop planning", icon: Sprout },
  { group: "Grow", href: "/dashboard/seasonal", label: "Seasonal guide", icon: CalendarRange },
  { group: "Grow", href: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { group: "Support", href: "/dashboard/schemes", label: "Government schemes", icon: Landmark },
  { group: "Support", href: "/dashboard/insurance", label: "Insurance", icon: ShieldCheck },
  { group: "Support", href: "/dashboard/experts", label: "Talk to a plant doctor", icon: Video },
  { group: "Trade", href: "/dashboard/marketplace", label: "Buy inputs", icon: ShoppingBag },
  { group: "Trade", href: "/dashboard/sell", label: "Sell produce", icon: Store },
  { group: "Trade", href: "/dashboard/loans", label: "Farm loans", icon: HandCoins },
  { group: "Trade", href: "/dashboard/equipment", label: "Book equipment", icon: Tractor },
  { group: "Community", href: "/dashboard/community", label: "Community forum", icon: Users },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const down = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  const groups = Array.from(new Set(destinations.map((d) => d.group)));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-soil/50 px-4 pt-24 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-soil/10 bg-paper shadow-2xl dark:border-paper/10 dark:bg-night-card"
      >
        <div className="flex items-center gap-2 border-b border-soil/10 px-4 py-3 dark:border-paper/10">
          <Search className="h-4 w-4 text-soil-700/50 dark:text-paper/40" />
          <Command.Input
            autoFocus
            placeholder="Jump to weather, marketplace, loans…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-soil-700/40 dark:placeholder:text-paper/30"
          />
          <kbd className="rounded border border-soil/15 px-1.5 py-0.5 font-mono text-[10px] text-soil-700/50 dark:border-paper/15 dark:text-paper/40">esc</kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-soil-700/50">No results found.</Command.Empty>
          {groups.map((g) => (
            <Command.Group key={g} heading={g} className="px-2 py-1 text-[11px] font-mono uppercase tracking-wide text-leaf-600 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pb-1">
              {destinations.filter((d) => d.group === g).map((d) => (
                <Command.Item
                  key={d.href}
                  onSelect={() => go(d.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-soil data-[selected=true]:bg-leaf-200/40 dark:text-paper dark:data-[selected=true]:bg-paper/10"
                >
                  <d.icon className="h-4 w-4 text-leaf" /> {d.label}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}

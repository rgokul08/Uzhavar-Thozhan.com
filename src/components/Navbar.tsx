"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, Menu, X } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#stats", label: "Impact" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "#schemes", label: "Schemes" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-soil/5 bg-paper/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-soil">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf text-paper">
            <Sprout className="h-5 w-5" />
          </div>
          <span>
            Uzhavar <span className="text-leaf">Thozhan</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-soil-700 transition-colors hover:bg-leaf-100 hover:text-leaf-700"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="ml-4 rounded-full bg-leaf px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-leaf-600 focus-ring"
          >
            Farmer Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-soil/5 bg-paper px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-soil-700 hover:bg-leaf-100"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-leaf px-6 py-3 text-center text-sm font-semibold text-paper"
          >
            Farmer Login
          </Link>
        </div>
      )}
    </header>
  );
}

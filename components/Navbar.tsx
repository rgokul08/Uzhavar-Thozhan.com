"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sprout } from "lucide-react";

const links = [
  { href: "/crops", label: "Crop Match" },
  { href: "/schemes", label: "Govt. Schemes" },
  { href: "/weather", label: "Weather" },
  { href: "/seasonal", label: "Season Guide" },
  { href: "/insurance", label: "Insurance" },
  { href: "/consult", label: "Ask a Doctor" },
  { href: "/seeds", label: "Inputs Store" },
  { href: "/marketplace", label: "Sell Produce" },
  { href: "/loans", label: "Loans" },
  { href: "/equipment", label: "Equipment" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paddy text-husk border-b border-paddy-dark">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Sprout className="text-turmeric" size={22} />
          Uzhavar Thozhan
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-turmeric transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm hover:text-turmeric">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-turmeric text-ink text-sm font-semibold px-4 py-2 rounded hover:bg-turmeric-dark hover:text-husk transition-colors"
          >
            Join as Farmer
          </Link>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden px-4 pb-4 flex flex-col gap-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/20">
            <Link href="/login">Log in</Link>
            <Link href="/register" className="text-turmeric font-semibold">
              Join as Farmer
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

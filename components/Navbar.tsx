"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sprout, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#features", label: "Features" },
  { href: "#schemes", label: "Schemes" },
  { href: "#market", label: "Market" },
  { href: "#experts", label: "Experts" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-soil/10 bg-paper/90 backdrop-blur dark:border-paper/10 dark:bg-night/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold dark:text-paper">
          <Sprout className="h-6 w-6 text-leaf" strokeWidth={2.2} />
          Uzhavar Thozhan
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-soil-700 hover:text-leaf transition-colors dark:text-paper/70">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="hidden items-center gap-1.5 rounded-full border border-soil/15 px-3 py-1.5 text-xs text-soil-700/60 lg:flex dark:border-paper/15 dark:text-paper/50"
          >
            <Command className="h-3 w-3" /> K
          </button>
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="rounded-full bg-leaf px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-leaf-600 focus-ring"
          >
            Farmer Login
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="focus-ring" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-soil/10 md:hidden dark:border-paper/10"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium dark:text-paper/80">
                  {l.label}
                </a>
              ))}
              <Link href="/auth/login" className="rounded-full bg-leaf px-5 py-2 text-center text-sm font-semibold text-paper">
                Farmer Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

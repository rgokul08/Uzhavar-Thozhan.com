import Link from "next/link";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-soil/10 bg-soil text-paper/80">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
            <Sprout className="h-5 w-5 text-turmeric" />
            Uzhavar Thozhan
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            உழவர் தோழன் — every farmer&apos;s companion, from soil to sale, in one place.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-paper mb-3 text-sm tracking-wide uppercase">Grow</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard/crops">Crop Planning</Link></li>
            <li><Link href="/dashboard/weather">Weather</Link></li>
            <li><Link href="/dashboard/seasonal">Seasonal Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-paper mb-3 text-sm tracking-wide uppercase">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard/schemes">Govt Schemes</Link></li>
            <li><Link href="/dashboard/insurance">Insurance</Link></li>
            <li><Link href="/dashboard/loans">Loans</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-paper mb-3 text-sm tracking-wide uppercase">Trade</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard/marketplace">Buy Inputs</Link></li>
            <li><Link href="/dashboard/sell">Sell Produce</Link></li>
            <li><Link href="/dashboard/equipment">Book Equipment</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} Uzhavar Thozhan. Built for farmers, by design.
      </div>
    </footer>
  );
}

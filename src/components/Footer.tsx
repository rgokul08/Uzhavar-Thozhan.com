import Link from "next/link";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-soil/10 bg-soil text-paper/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-paper">
            <Sprout className="h-5 w-5 text-turmeric" />
            Uzhavar Thozhan
          </div>
          <p className="mt-3 text-sm leading-relaxed text-paper/60">
            உழவர் தோழன் — every farmer&apos;s companion, from soil to sale, in one place.
            Built for Indian farmers, by design.
          </p>
          <div className="mt-6 space-y-2 text-sm text-paper/50">
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span>1800-XXX-XXXX (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>support@uzhavarThozhan.in</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-paper">
            Grow
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard/crops" className="hover:text-leaf transition-colors">Crop Planning</Link>
            </li>
            <li>
              <Link href="/dashboard/weather" className="hover:text-leaf transition-colors">Weather</Link>
            </li>
            <li>
              <Link href="/dashboard/seasonal" className="hover:text-leaf transition-colors">Seasonal Guide</Link>
            </li>
            <li>
              <Link href="/dashboard/soil" className="hover:text-leaf transition-colors">Soil Analysis</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-paper">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard/schemes" className="hover:text-leaf transition-colors">Govt Schemes</Link>
            </li>
            <li>
              <Link href="/dashboard/insurance" className="hover:text-leaf transition-colors">Insurance</Link>
            </li>
            <li>
              <Link href="/dashboard/loans" className="hover:text-leaf transition-colors">Loans</Link>
            </li>
            <li>
              <Link href="/dashboard/experts" className="hover:text-leaf transition-colors">Plant Doctors</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-paper">
            Trade
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard/marketplace" className="hover:text-leaf transition-colors">Buy Inputs</Link>
            </li>
            <li>
              <Link href="/dashboard/sell" className="hover:text-leaf transition-colors">Sell Produce</Link>
            </li>
            <li>
              <Link href="/dashboard/equipment" className="hover:text-leaf transition-colors">Book Equipment</Link>
            </li>
            <li>
              <Link href="/dashboard/community" className="hover:text-leaf transition-colors">Community</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} Uzhavar Thozhan. Built for farmers, by design. All rights reserved.
      </div>
    </footer>
  );
}

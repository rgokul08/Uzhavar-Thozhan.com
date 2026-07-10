"use client";

import { Landmark, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";

const schemes = [
  {
    name: "PM-KISAN",
    desc: "₹6,000/year direct income support in 3 equal instalments to small & marginal farmer families.",
    benefit: "₹6,000/year",
    link: "https://pmkisan.gov.in",
  },
  {
    name: "PMFBY",
    desc: "Pradhan Mantri Fasal Bima Yojana — crop insurance at just 1.5–5% premium, covering natural calamities.",
    benefit: "Up to ₹2L cover",
    link: "https://pmfby.gov.in",
  },
  {
    name: "Kisan Credit Card",
    desc: "Short-term credit for crops, post-harvest, consumption and investment at subsidised interest rates.",
    benefit: "4% interest rate",
    link: "https://www.nabard.org",
  },
  {
    name: "Soil Health Card",
    desc: "Free soil testing and a printed card with nutrient status and fertiliser recommendation for your farm.",
    benefit: "Free soil test",
    link: "https://soilhealth.dac.gov.in",
  },
];

export default function SchemesPreview() {
  return (
    <section id="schemes" className="bg-soil-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-leaf-600">Government Support</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-soil sm:text-4xl">
              Never miss a scheme you qualify for.
            </h2>
          </div>
          <Link
            href="/dashboard/schemes"
            className="hidden items-center gap-1 text-sm font-semibold text-leaf hover:underline sm:flex"
          >
            View all schemes <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {schemes.map((s) => (
            <div
              key={s.name}
              className="card-hover rounded-2xl border border-soil/5 bg-white p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-soil">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soil-600">{s.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-700">
                  {s.benefit}
                </span>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-soil-400 hover:text-leaf"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

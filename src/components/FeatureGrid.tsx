"use client";

import {
  Sprout, CloudSun, Landmark, ShieldCheck, FileCheck2, Video,
  ShoppingBag, Store, HandCoins, Tractor, Wheat, CalendarRange, Users, Bot, FlaskConical,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  { icon: Bot, title: "AI Farming Assistant", desc: "Ask crop, disease, scheme or price questions in English, Tamil or Hindi — answered instantly.", color: "bg-purple-100 text-purple-600" },
  { icon: FlaskConical, title: "Soil Health Score", desc: "Enter your soil test card readings for an instant 0–100 health score and fertiliser plan.", color: "bg-amber-100 text-amber-600" },
  { icon: Sprout, title: "Crop Planning by Soil", desc: "Recommends crops per land parcel using your soil type, N-P-K levels and pH.", color: "bg-leaf-100 text-leaf-600" },
  { icon: CalendarRange, title: "Seasonal Suggestions", desc: "Kharif, Rabi and Zaid crop calendars matched to your region and sowing window.", color: "bg-cyan-100 text-cyan-600" },
  { icon: CloudSun, title: "Live Weather", desc: "Hyperlocal forecasts and alerts so you know before you sow, spray or harvest.", color: "bg-sky-100 text-sky-600" },
  { icon: Landmark, title: "Govt Schemes & Laws", desc: "PM-KISAN, PMFBY, KCC and more — eligibility, benefit and official links, in one list.", color: "bg-indigo-100 text-indigo-600" },
  { icon: ShieldCheck, title: "Crop Insurance", desc: "Buy and track PMFBY and private crop insurance policies against one dashboard.", color: "bg-emerald-100 text-emerald-600" },
  { icon: FileCheck2, title: "Claim Insurance", desc: "File a loss claim with photo evidence and follow its status end to end.", color: "bg-red-100 text-red-600" },
  { icon: Video, title: "Talk to Plant Doctors", desc: "Book a live video consultation with agronomists, soil and pest-control experts.", color: "bg-violet-100 text-violet-600" },
  { icon: ShoppingBag, title: "Buy Pesticides & Inputs", desc: "Order pesticides, fertiliser, seeds and tools, delivered to your village.", color: "bg-orange-100 text-orange-600" },
  { icon: Store, title: "Sell Your Produce", desc: "List harvested crop for the open market, private companies or government procurement.", color: "bg-teal-100 text-teal-600" },
  { icon: HandCoins, title: "Farm Loans", desc: "Apply for Kisan Credit Card and other agri-loans, and track approval status.", color: "bg-yellow-100 text-yellow-600" },
  { icon: Tractor, title: "Book Machinery", desc: "Reserve tractors, drone sprayers, harvesters and planting robots by the day.", color: "bg-rose-100 text-rose-600" },
  { icon: Wheat, title: "Buy Seeds & Saplings", desc: "Certified, high-yield seed varieties matched to your soil and season.", color: "bg-lime-100 text-lime-600" },
  { icon: Users, title: "Farmer Community", desc: "Ask questions, share results and learn from farmers growing the same crop nearby.", color: "bg-blue-100 text-blue-600" },
];

export default function FeatureGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24" ref={ref}>
      <div className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf-600">What&apos;s inside</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-soil sm:text-4xl">
          Everything a farm needs, nothing you have to hunt for.
        </h2>
        <p className="mt-4 text-soil-600">
          15 essential services in one platform. No switching apps, no paper forms, no middlemen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`card-hover group rounded-2xl border border-soil/5 bg-white/60 p-6 transition-all duration-500 hover:border-leaf/40 hover:bg-white ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <div
              className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color} transition-colors group-hover:bg-leaf group-hover:text-paper`}
            >
              <f.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="font-display text-lg font-semibold text-soil">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-soil-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

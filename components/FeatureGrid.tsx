"use client";

import { motion } from "framer-motion";
import {
  Sprout, CloudSun, Landmark, ShieldCheck, FileCheck2, Video,
  ShoppingBag, Store, HandCoins, Tractor, Wheat, CalendarRange, Users, Bot, FlaskConical,
} from "lucide-react";

const features = [
  { icon: Bot, title: "AI Farming Assistant", desc: "Ask crop, disease, scheme or price questions in English, Tamil or Hindi — answered instantly." },
  { icon: FlaskConical, title: "Soil Health Score", desc: "Enter your soil test card readings for an instant 0–100 health score and fertiliser plan." },
  { icon: Sprout, title: "Crop Planning by Soil", desc: "Recommends crops per land parcel using your soil type, N-P-K levels and pH." },
  { icon: CalendarRange, title: "Seasonal Suggestions", desc: "Kharif, Rabi and Zaid crop calendars matched to your region and sowing window." },
  { icon: CloudSun, title: "Live Weather", desc: "Hyperlocal forecasts and alerts so you know before you sow, spray or harvest." },
  { icon: Landmark, title: "Govt Schemes & Laws", desc: "PM-KISAN, PMFBY, KCC and more — eligibility, benefit and official links, in one list." },
  { icon: ShieldCheck, title: "Crop Insurance", desc: "Buy and track PMFBY and private crop insurance policies against one dashboard." },
  { icon: FileCheck2, title: "Claim Insurance", desc: "File a loss claim with photo evidence and follow its status end to end." },
  { icon: Video, title: "Talk to Plant Doctors", desc: "Book a live video consultation with agronomists, soil and pest-control experts." },
  { icon: ShoppingBag, title: "Buy Pesticides & Inputs", desc: "Order pesticides, fertiliser, seeds and tools, delivered to your village." },
  { icon: Store, title: "Sell Your Produce", desc: "List harvested crop for the open market, private companies or government procurement." },
  { icon: HandCoins, title: "Farm Loans", desc: "Apply for Kisan Credit Card and other agri-loans, and track approval status." },
  { icon: Tractor, title: "Book Machinery", desc: "Reserve tractors, drone sprayers, harvesters and planting robots by the day." },
  { icon: Wheat, title: "Buy Seeds & Saplings", desc: "Certified, high-yield seed varieties matched to your soil and season." },
  { icon: Users, title: "Farmer Community", desc: "Ask questions, share results and learn from farmers growing the same crop nearby." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-leaf-600">What&apos;s inside</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-soil sm:text-4xl">
          Everything a farm needs, nothing you have to hunt for.
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group rounded-2xl border border-soil/10 bg-white/60 p-6 transition-colors hover:border-leaf/40 hover:bg-white"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-200/50 text-leaf-600 transition-colors group-hover:bg-leaf group-hover:text-paper">
              <f.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="font-display text-lg font-semibold text-soil">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-soil-700">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

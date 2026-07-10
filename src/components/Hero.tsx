"use client";

import Link from "next/link";
import { ArrowRight, Sprout, CloudSun, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden bg-field-lines">
      <div className="aurora pointer-events-none opacity-40" />

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {mounted && (
          <>
            <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-leaf-200/20 blur-3xl" />
            <div className="absolute right-[15%] top-[30%] h-48 w-48 rounded-full bg-turmeric/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[30%] h-56 w-56 rounded-full bg-sky-blue/10 blur-3xl" />
          </>
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-28">
        <div>
          <p className="mb-4 inline-block rounded-full border border-leaf/30 bg-leaf-200/40 px-4 py-1.5 font-mono text-xs tracking-wide text-leaf-700">
            உழவர் தோழன் · FARMER&apos;S COMPANION
          </p>
          <h1
            className={`font-display text-4xl font-bold leading-[1.08] text-soil transition-all duration-700 sm:text-5xl lg:text-6xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            From soil test to sale price,{" "}
            <em className="not-italic text-leaf">one farm office</em> in your pocket.
          </h1>
          <p
            className={`mt-6 max-w-xl text-lg text-soil-600 transition-all delay-100 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Uzhavar Thozhan brings crop planning, live weather, government schemes, crop insurance,
            expert video consultations, input marketplace, produce sales, loans and machinery booking
            into a single sign-in.
          </p>
          <div
            className={`mt-9 flex flex-wrap items-center gap-4 transition-all delay-200 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 font-semibold text-paper transition-all hover:bg-leaf-600 hover:shadow-lg hover:shadow-leaf/25 focus-ring"
            >
              Start with your phone number
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold text-soil-600 underline underline-offset-4 hover:text-leaf"
            >
              See everything inside
            </a>
          </div>
        </div>

        {/* Illustration replacement - animated card stack */}
        <div
          className={`flex justify-center transition-all delay-300 duration-1000 ${
            mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="relative w-full max-w-md">
            {/* Card 1 */}
            <div className="card-hover rounded-2xl border border-leaf/20 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-soil">Crop Dashboard</p>
                  <p className="text-xs text-soil-500">Real-time monitoring</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-soil-600">Rice (Ponni)</span>
                  <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-medium text-leaf-700">
                    Growing
                  </span>
                </div>
                <div className="h-2 rounded-full bg-leaf-100">
                  <div className="h-2 w-3/4 rounded-full bg-leaf" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-soil-600">Tomato</span>
                  <span className="rounded-full bg-turmeric/20 px-2 py-0.5 text-xs font-medium text-turmeric">
                    Harvest Ready
                  </span>
                </div>
                <div className="h-2 rounded-full bg-turmeric/20">
                  <div className="h-2 w-full rounded-full bg-turmeric" />
                </div>
              </div>
            </div>

            {/* Card 2 - Weather */}
            <div className="card-hover absolute -right-4 top-8 w-48 rounded-xl border border-sky-blue/20 bg-white/90 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-sky-blue" />
                <span className="text-sm font-semibold">Weather</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-soil">32°C</p>
              <p className="text-xs text-soil-500">Partly cloudy, Thanjavur</p>
              <div className="mt-2 flex gap-2 text-xs text-soil-500">
                <span>💧 72%</span>
                <span>🌬️ 12 km/h</span>
              </div>
            </div>

            {/* Card 3 - Insurance */}
            <div className="card-hover absolute -left-4 bottom-0 w-52 rounded-xl border border-leaf/20 bg-white/90 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-leaf" />
                <span className="text-sm font-semibold">PMFBY Active</span>
              </div>
              <p className="mt-1 text-xs text-soil-500">Kharif 2025 • ₹2,00,000 covered</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
                <span className="text-xs text-leaf-600">Policy Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

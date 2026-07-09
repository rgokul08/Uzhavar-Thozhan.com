"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FarmSceneCanvas from "./FarmSceneCanvas";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-field-lines">
      <div className="aurora pointer-events-none opacity-40 dark:opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full border border-leaf/30 bg-leaf-200/40 px-4 py-1 font-mono text-xs tracking-wide text-leaf-600"
          >
            உழவர் தோழன் · FARMER&apos;S COMPANION
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-[1.08] text-soil sm:text-5xl lg:text-6xl"
          >
            From soil test to sale price, <em className="italic text-leaf">one farm office</em> in your pocket.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-soil-700"
          >
            Uzhavar Thozhan brings crop planning, live weather, government schemes, crop
            insurance, expert video consultations, input marketplace, produce sales,
            loans and machinery booking into a single sign-in.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 font-semibold text-paper transition-colors hover:bg-leaf-600 focus-ring"
            >
              Start with your phone number
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="text-sm font-semibold text-soil-700 underline underline-offset-4 hover:text-leaf">
              See everything inside
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <FarmSceneCanvas />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const rings = [
  { r: 220, color: "#332415", delay: 0 },
  { r: 175, color: "#4A3420", delay: 0.1 },
  { r: 130, color: "#5C9A5F", delay: 0.2 },
  { r: 85, color: "#2F6B3C", delay: 0.3 },
  { r: 40, color: "#D8A425", delay: 0.4 },
];

export default function FieldRings() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 500 500"
        className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rings-signature"
        aria-hidden="true"
      >
        {rings.map((ring) => (
          <motion.circle
            key={ring.r}
            cx="250"
            cy="250"
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth="2"
            strokeDasharray="6 10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.9, delay: ring.delay, ease: [0.22, 1, 0.36, 1] as const }}
          />
        ))}
        {/* sprout growing from the center, on a slight delay after the rings settle */}
        <motion.path
          d="M250 260 C 248 220, 248 190, 250 160"
          stroke="#2F6B3C"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        />
        <motion.path
          d="M250 200 C 230 190, 215 195, 208 178"
          stroke="#5C9A5F"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
        />
        <motion.path
          d="M250 220 C 270 212, 283 216, 292 200"
          stroke="#5C9A5F"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.25, ease: "easeOut" }}
        />
        <motion.circle
          cx="250"
          cy="160"
          r="7"
          fill="#EFC968"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.5, type: "spring", stiffness: 200 }}
        />
      </svg>
    </div>
  );
}

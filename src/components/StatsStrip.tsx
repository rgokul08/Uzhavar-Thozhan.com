"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Services in one login" },
  { value: 50000, suffix: "+", label: "Farmers registered" },
  { value: 24, suffix: "×7", label: "Weather & alerts" },
  { value: 0, suffix: "%", label: "Commission on produce sales" },
];

function AnimatedCounter({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(increment * step));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, target]);

  const displayValue = target >= 1000 ? `${(current / 1000).toFixed(current >= target ? 0 : 0)}K` : current.toString();

  return (
    <span>
      {target >= 1000 ? `${Math.round(current / 1000)}K` : current}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="border-y border-soil/10 bg-soil">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-bold text-turmeric sm:text-4xl">
              <AnimatedCounter target={s.value} suffix={s.suffix} started={started} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-wide text-paper/60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

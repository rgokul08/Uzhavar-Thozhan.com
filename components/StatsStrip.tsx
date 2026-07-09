"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 13, suffix: "+", label: "Services in one login" },
  { value: 8, suffix: "-digit", label: "OTP secured sign-in" },
  { value: 24, suffix: "×7", label: "Weather & alerts" },
  { value: 0, suffix: "%", label: "Commission on produce sales" },
];

export default function StatsStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const counters = sectionRef.current?.querySelectorAll<HTMLElement>("[data-counter]");
      counters?.forEach((el) => {
        const target = Number(el.dataset.counter);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-soil/10 bg-soil dark:border-paper/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-turmeric">
              <span data-counter={s.value}>0</span>{s.suffix}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-paper/60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajendran K.",
    location: "Thanjavur, Tamil Nadu",
    text: "Uzhavar Thozhan helped me plan my crops based on soil test results. My rice yield improved by 30% this season!",
    rating: 5,
    crop: "Rice farmer",
  },
  {
    name: "Lakshmi S.",
    location: "Tirunelveli, Tamil Nadu",
    text: "I got my PMFBY insurance claim settled within 2 weeks through the platform. Earlier it used to take months.",
    rating: 5,
    crop: "Cotton farmer",
  },
  {
    name: "Murugan P.",
    location: "Erode, Tamil Nadu",
    text: "The marketplace feature lets me sell directly to buyers. No middlemen, better prices. My family income doubled.",
    rating: 5,
    crop: "Turmeric farmer",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf-600">
            Farmer Voices
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-soil sm:text-4xl">
            Trusted by farmers across Tamil Nadu
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-hover relative rounded-2xl border border-soil/5 bg-white p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-leaf-100" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-turmeric text-turmeric"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-soil-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 border-t border-soil/5 pt-4">
                <p className="font-semibold text-soil">{t.name}</p>
                <p className="text-xs text-soil-500">
                  {t.crop} • {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

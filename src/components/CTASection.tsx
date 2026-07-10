import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-leaf">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-paper sm:text-4xl">
          Sign in with just your phone number.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-leaf-100">
          No passwords to remember. We send a secure code by SMS — enter it once and your farm
          dashboard is ready. Free forever for Indian farmers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full bg-turmeric px-8 py-3.5 font-semibold text-soil transition-transform hover:scale-105 focus-ring"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border-2 border-paper/30 px-8 py-3.5 font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Explore Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

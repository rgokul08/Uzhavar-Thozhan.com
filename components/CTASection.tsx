import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-leaf">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">
          Sign in with just your phone number.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-leaf-200">
          No passwords to remember. We send an 8-digit code by SMS — enter it once and your
          farm dashboard is ready.
        </p>
        <Link
          href="/auth/login"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-turmeric px-8 py-3.5 font-semibold text-soil transition-transform hover:scale-105 focus-ring"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

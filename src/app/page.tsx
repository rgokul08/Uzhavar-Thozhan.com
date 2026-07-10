import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import StatsStrip from "@/components/StatsStrip";
import CTASection from "@/components/CTASection";
import SchemesPreview from "@/components/SchemesPreview";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsStrip />
      <FeatureGrid />
      <SchemesPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import StatsStrip from "@/components/StatsStrip";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <FeatureGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

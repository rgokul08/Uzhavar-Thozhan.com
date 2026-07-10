import { db } from "@/db";
import { govSchemes } from "@/db/schema";
import { Landmark, ExternalLink, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

const defaultSchemes = [
  { name: "PM-KISAN", description: "Direct income support of ₹6,000 per year to small and marginal farmer families, paid in three equal instalments.", benefit: "₹6,000/year", eligibility: "All land-holding farmer families", link: "https://pmkisan.gov.in", category: "Income Support" },
  { name: "PMFBY", description: "Pradhan Mantri Fasal Bima Yojana provides crop insurance at subsidised premium rates (1.5% for Rabi, 2% for Kharif).", benefit: "Up to ₹2,00,000", eligibility: "All farmers growing notified crops", link: "https://pmfby.gov.in", category: "Insurance" },
  { name: "Kisan Credit Card (KCC)", description: "Short-term credit for crop production, post-harvest, consumption, and investment at just 4% interest (with interest subvention).", benefit: "Up to ₹3,00,000 at 4% interest", eligibility: "All farmers, fishermen, animal husbandry farmers", link: "https://www.nabard.org", category: "Credit" },
  { name: "Soil Health Card Scheme", description: "Free soil testing through government labs with a detailed card showing nutrient status and crop-wise fertiliser recommendations.", benefit: "Free soil test + card", eligibility: "All Indian farmers", link: "https://soilhealth.dac.gov.in", category: "Soil Health" },
  { name: "PM Kisan Maan Dhan Yojana", description: "Pension scheme for small and marginal farmers — ₹3,000/month pension after age 60 with monthly contribution of ₹55–200.", benefit: "₹3,000/month pension", eligibility: "Small & marginal farmers (age 18-40)", link: "https://maandhan.in", category: "Pension" },
  { name: "e-NAM (National Agriculture Market)", description: "Online trading platform for agricultural commodities — farmers can sell directly to buyers across state mandis.", benefit: "Better price discovery", eligibility: "All farmers and traders", link: "https://enam.gov.in", category: "Market Access" },
  { name: "Paramparagat Krishi Vikas Yojana", description: "Support for organic farming clusters — ₹50,000/ha over 3 years for organic inputs, seeds, and certification.", benefit: "₹50,000/ha over 3 years", eligibility: "Farmer groups (minimum 50 farmers, 50 acres)", link: "https://pgsindia-ncof.gov.in", category: "Organic Farming" },
  { name: "Micro Irrigation Fund (PMKSY)", description: "90% subsidy on drip and sprinkler irrigation systems under PM Krishi Sinchai Yojana — save water, increase yield.", benefit: "Up to 90% subsidy", eligibility: "All farmers", link: "https://pmksy.gov.in", category: "Irrigation" },
];

export default async function SchemesPage() {
  let schemes = await db.select().from(govSchemes);

  // If no seeded schemes, show defaults
  if (schemes.length === 0) {
    schemes = defaultSchemes.map((s, i) => ({
      id: i + 1,
      name: s.name,
      description: s.description,
      benefit: s.benefit,
      eligibility: s.eligibility,
      link: s.link,
      category: s.category,
      isActive: true,
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Government Schemes for Farmers</h1>
        <p className="mt-1 text-soil-600">
          All major central and state government schemes in one place. Check eligibility and apply online.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {(schemes.length > 0 ? schemes : defaultSchemes.map((s, i) => ({ ...s, id: i + 1, isActive: true }))).map((scheme) => (
          <div key={scheme.id} className="card-hover rounded-2xl border border-soil/5 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-soil">{scheme.name}</h3>
                  {scheme.category && (
                    <span className="inline-flex items-center gap-1 text-xs text-soil-500">
                      <Tag className="h-3 w-3" />
                      {scheme.category}
                    </span>
                  )}
                </div>
              </div>
              {scheme.link && (
                <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg p-2 text-soil-400 hover:bg-soil-50 hover:text-leaf">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-soil-600">{scheme.description}</p>

            <div className="mt-4 space-y-2">
              {scheme.benefit && (
                <div className="rounded-lg bg-leaf-50 px-3 py-2">
                  <span className="text-xs font-medium text-leaf-700">💰 Benefit: {scheme.benefit}</span>
                </div>
              )}
              {scheme.eligibility && (
                <div className="rounded-lg bg-sky-50 px-3 py-2">
                  <span className="text-xs font-medium text-sky-700">👤 Eligibility: {scheme.eligibility}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

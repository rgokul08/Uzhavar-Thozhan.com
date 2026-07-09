export type SoilType =
  | "alluvial"
  | "black"
  | "red"
  | "laterite"
  | "arid"
  | "saline"
  | "peaty"
  | "forest";

export interface CropRecommendation {
  crop: string;
  idealPh: [number, number];
  n: "low" | "medium" | "high";
  p: "low" | "medium" | "high";
  k: "low" | "medium" | "high";
  season: "kharif" | "rabi" | "zaid";
  notes: string;
}

export const SOIL_LABELS: Record<SoilType, string> = {
  alluvial: "Alluvial Soil",
  black: "Black (Regur) Soil",
  red: "Red Soil",
  laterite: "Laterite Soil",
  arid: "Arid / Desert Soil",
  saline: "Saline / Alkaline Soil",
  peaty: "Peaty / Marshy Soil",
  forest: "Forest / Mountain Soil",
};

export const CROPS_BY_SOIL: Record<SoilType, CropRecommendation[]> = {
  alluvial: [
    { crop: "Paddy (Rice)", idealPh: [5.5, 7], n: "high", p: "medium", k: "medium", season: "kharif", notes: "Needs standing water; alluvial soil retains moisture well." },
    { crop: "Wheat", idealPh: [6, 7.5], n: "high", p: "medium", k: "low", season: "rabi", notes: "Thrives in the fine, fertile texture of alluvial plains." },
    { crop: "Sugarcane", idealPh: [6, 7.5], n: "high", p: "high", k: "high", season: "kharif", notes: "Heavy feeder — respond well to alluvial soil's natural fertility." },
  ],
  black: [
    { crop: "Cotton", idealPh: [6, 8], n: "medium", p: "low", k: "medium", season: "kharif", notes: "Black soil's moisture retention suits cotton's long growing season." },
    { crop: "Soybean", idealPh: [6, 7], n: "low", p: "medium", k: "medium", season: "kharif", notes: "Fixes its own nitrogen; pairs well with black soil's mineral content." },
    { crop: "Groundnut", idealPh: [6, 6.5], n: "low", p: "medium", k: "medium", season: "kharif", notes: "Good drainage pockets in black soil help pod development." },
  ],
  red: [
    { crop: "Millets (Ragi/Bajra)", idealPh: [5, 6.5], n: "low", p: "low", k: "medium", season: "kharif", notes: "Hardy in the lower fertility typical of red soil." },
    { crop: "Groundnut", idealPh: [6, 6.5], n: "low", p: "medium", k: "medium", season: "kharif", notes: "Tolerates red soil's lighter texture and moderate drainage." },
    { crop: "Pulses (Redgram)", idealPh: [6, 7], n: "low", p: "medium", k: "low", season: "kharif", notes: "Improves soil nitrogen naturally over the season." },
  ],
  laterite: [
    { crop: "Cashew", idealPh: [4.5, 6.5], n: "low", p: "medium", k: "medium", season: "kharif", notes: "Well suited to laterite's acidic, well-drained profile." },
    { crop: "Tea", idealPh: [4.5, 5.5], n: "medium", p: "low", k: "medium", season: "kharif", notes: "Prefers acidic laterite soils on sloped terrain." },
    { crop: "Tapioca", idealPh: [5, 6.5], n: "low", p: "low", k: "high", season: "kharif", notes: "Tolerant of laterite's lower natural fertility." },
  ],
  arid: [
    { crop: "Bajra (Pearl Millet)", idealPh: [6.5, 8], n: "low", p: "low", k: "medium", season: "kharif", notes: "Drought-tolerant, ideal for arid, sandy soils." },
    { crop: "Moong (Green Gram)", idealPh: [6.5, 7.5], n: "low", p: "medium", k: "low", season: "zaid", notes: "Short duration crop that suits limited-water arid regions." },
    { crop: "Guar (Cluster Bean)", idealPh: [6.5, 8], n: "low", p: "low", k: "low", season: "kharif", notes: "Extremely drought hardy, low input requirement." },
  ],
  saline: [
    { crop: "Barley", idealPh: [6.5, 8.5], n: "medium", p: "low", k: "medium", season: "rabi", notes: "One of the few cereals tolerant of moderate salinity." },
    { crop: "Sugar Beet", idealPh: [6.5, 8], n: "medium", p: "medium", k: "medium", season: "rabi", notes: "Naturally salt-tolerant root crop." },
    { crop: "Cotton (salt-tolerant varieties)", idealPh: [6.5, 8.5], n: "medium", p: "low", k: "medium", season: "kharif", notes: "Choose CICR-recommended saline-tolerant cultivars." },
  ],
  peaty: [
    { crop: "Jute", idealPh: [6, 7.5], n: "medium", p: "low", k: "medium", season: "kharif", notes: "Marshy, moisture-rich peaty soils suit jute retting cycles." },
    { crop: "Paddy (Rice)", idealPh: [5.5, 7], n: "high", p: "medium", k: "medium", season: "kharif", notes: "High organic content of peaty soil supports rice well." },
    { crop: "Taro (Colocasia)", idealPh: [5.5, 6.5], n: "medium", p: "low", k: "medium", season: "kharif", notes: "Grows well in the waterlogged conditions of peaty land." },
  ],
  forest: [
    { crop: "Spices (Cardamom/Pepper)", idealPh: [5, 6.5], n: "medium", p: "medium", k: "medium", season: "kharif", notes: "Shade-loving spices thrive in forest-margin, humus-rich soil." },
    { crop: "Coffee", idealPh: [6, 6.5], n: "medium", p: "medium", k: "medium", season: "kharif", notes: "Needs the organic matter and slope drainage of forest soils." },
    { crop: "Fruit Orchards (Citrus)", idealPh: [5.5, 6.5], n: "medium", p: "medium", k: "medium", season: "rabi", notes: "Well-drained forest soil supports deep root systems." },
  ],
};

export const SEASONAL_CALENDAR: Record<"kharif" | "rabi" | "zaid", { months: string; crops: string[]; tip: string }> = {
  kharif: {
    months: "June – October (Southwest Monsoon)",
    crops: ["Paddy", "Cotton", "Soybean", "Groundnut", "Bajra", "Maize", "Sugarcane"],
    tip: "Sow right after the first reliable monsoon showers; ensure field bunding to manage excess water.",
  },
  rabi: {
    months: "October – March (Winter)",
    crops: ["Wheat", "Barley", "Mustard", "Chickpea (Gram)", "Peas", "Sugar Beet"],
    tip: "Relies on residual soil moisture and irrigation; sow early November for the best yield window.",
  },
  zaid: {
    months: "March – June (Summer)",
    crops: ["Watermelon", "Cucumber", "Moong", "Fodder crops", "Muskmelon"],
    tip: "Short-duration, irrigation-fed crops — plan around available water source before sowing.",
  },
};

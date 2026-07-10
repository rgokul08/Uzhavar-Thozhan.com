import { CalendarRange, Sprout, CloudSun, Droplets } from "lucide-react";

const seasons = [
  {
    name: "Kharif (Jun–Oct)",
    color: "border-leaf/30 bg-leaf-50",
    tagColor: "bg-leaf-100 text-leaf-700",
    icon: "🌧️",
    desc: "Monsoon season. Sowing begins with the onset of south-west monsoon rains.",
    crops: [
      { name: "Rice (Samba)", sowingWindow: "June–July", harvestWindow: "Nov–Dec", tips: "Prepare nursery beds. Transplant 25-day seedlings. Maintain 5cm standing water." },
      { name: "Cotton", sowingWindow: "June–July", harvestWindow: "Oct–Dec", tips: "Use Bt cotton varieties. Sow in ridges and furrows. First irrigation at sowing." },
      { name: "Groundnut", sowingWindow: "June–July", harvestWindow: "Sep–Oct", tips: "Treat seeds with Thiram. Sow at 30×10 cm spacing. Apply gypsum at flowering." },
      { name: "Sugarcane", sowingWindow: "Jun–Jul (late)", harvestWindow: "Next Apr–May", tips: "Use single-bud setts. Apply pre-emergence herbicide. Earth up at 45 & 90 days." },
      { name: "Maize", sowingWindow: "Jun–Jul", harvestWindow: "Sep–Oct", tips: "Use hybrid seeds. Sow at 60×20 cm. Apply nitrogen in 3 splits." },
    ],
  },
  {
    name: "Rabi (Oct–Mar)",
    color: "border-sky-blue/30 bg-sky-50",
    tagColor: "bg-sky-100 text-sky-700",
    icon: "❄️",
    desc: "Winter season. Crops grow on residual moisture and irrigated conditions.",
    crops: [
      { name: "Wheat", sowingWindow: "Oct–Nov", harvestWindow: "Mar–Apr", tips: "Use dwarf varieties. Irrigate at CRI stage. Apply 120-60-40 NPK kg/ha." },
      { name: "Onion", sowingWindow: "Oct–Nov", harvestWindow: "Feb–Mar", tips: "Transplant 6-week seedlings. Stop irrigation 10 days before harvest." },
      { name: "Tomato", sowingWindow: "Sep–Oct", harvestWindow: "Jan–Mar", tips: "Stake plants. Spray Mancozeb for late blight prevention." },
      { name: "Mustard", sowingWindow: "Oct–Nov", harvestWindow: "Feb–Mar", tips: "Sow in rows 30 cm apart. First irrigation at 30 DAS. Apply sulphur 40 kg/ha." },
      { name: "Potato", sowingWindow: "Oct–Nov", harvestWindow: "Jan–Feb", tips: "Cut tubers into 2-3 eye pieces. Ridge planting at 60×20 cm." },
    ],
  },
  {
    name: "Zaid (Mar–Jun)",
    color: "border-turmeric/30 bg-amber-50",
    tagColor: "bg-amber-100 text-amber-700",
    icon: "☀️",
    desc: "Summer season. Short-duration vegetables and fruits with assured irrigation.",
    crops: [
      { name: "Watermelon", sowingWindow: "Feb–Mar", harvestWindow: "May–Jun", tips: "Plant in river beds or sandy loam. Irrigate every 3 days. Harvest at maturity." },
      { name: "Muskmelon", sowingWindow: "Feb–Mar", harvestWindow: "May–Jun", tips: "Use pit system. Apply FYM at 10 t/ha. Pinch lateral branches." },
      { name: "Cucumber", sowingWindow: "Feb–Mar", harvestWindow: "Apr–May", tips: "Trellis system for better yield. Harvest every 2 days when bearing." },
      { name: "Sunflower", sowingWindow: "Mar–Apr", harvestWindow: "Jun–Jul", tips: "Sow at 60×30 cm. Apply boron for better seed set. Good bee pollination needed." },
      { name: "Green Gram (Moong)", sowingWindow: "Mar–Apr", harvestWindow: "May–Jun", tips: "Short 60-day crop. Seed treatment with Rhizobium. Light irrigation." },
    ],
  },
];

export default function SeasonalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-soil">Seasonal Crop Guide</h1>
        <p className="mt-1 text-soil-600">
          Kharif, Rabi and Zaid crop calendars with sowing windows and expert tips.
        </p>
      </div>

      {seasons.map((season) => (
        <div key={season.name} className={`rounded-2xl border ${season.color} p-6`}>
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">{season.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-soil">{season.name}</h2>
              <p className="text-sm text-soil-600">{season.desc}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {season.crops.map((crop) => (
              <div key={crop.name} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-leaf" />
                  <h3 className="font-semibold text-soil">{crop.name}</h3>
                </div>
                <div className="mt-3 space-y-2 text-sm text-soil-600">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-3.5 w-3.5 text-soil-400" />
                    <span>Sow: <strong>{crop.sowingWindow}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5 text-soil-400" />
                    <span>Harvest: <strong>{crop.harvestWindow}</strong></span>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-soil-50 p-3">
                  <p className="text-xs text-soil-600">
                    💡 {crop.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

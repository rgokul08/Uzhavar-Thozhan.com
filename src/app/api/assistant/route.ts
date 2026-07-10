import { NextRequest, NextResponse } from "next/server";

// Knowledge base for farming assistant
const knowledgeBase: Record<string, string> = {
  "black soil": "Black soil (Regur soil) is excellent for cotton, soybean, groundnut, sunflower, and jowar. It has high clay content and retains moisture well. Key tips:\n• Rich in calcium, magnesium, and iron\n• Poor in nitrogen, phosphorus, and organic matter\n• Apply farmyard manure (FYM) at 10 t/ha\n• Best suited for: Cotton, Sugarcane, Wheat, Jowar, Sunflower",
  "stem borer": "Stem borer in rice is a serious pest. Control measures:\n1. 🌾 **Cultural**: Remove and destroy stubbles after harvest. Drain the field periodically.\n2. 🧪 **Chemical**: Apply Cartap Hydrochloride 4G at 25 kg/ha or spray Chlorantraniliprole 0.4 GR.\n3. 🐛 **Biological**: Release Trichogramma japonicum egg parasitoids at 1 lakh/ha.\n4. 💡 **Tip**: Install pheromone traps at 5/ha to monitor moth population.",
  "pm-kisan": "**PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**\n\n💰 **Benefit**: ₹6,000/year in 3 instalments of ₹2,000 each\n\n👤 **Eligibility**:\n• All land-holding farmer families\n• Must have cultivable land\n• Excluded: Institutional landholders, income tax payers, government employees\n\n📋 **How to apply**:\n1. Visit pmkisan.gov.in\n2. Click 'New Farmer Registration'\n3. Enter Aadhaar number and state\n4. Fill land details and bank account\n5. Submit — amount credited directly to bank",
  "organic": "**Best Organic Fertilizers for Vegetables/Fruits:**\n\n🌱 **Vermicompost**: 5 t/ha — improves soil structure, provides all nutrients\n🐄 **FYM (Farm Yard Manure)**: 10–15 t/ha — slow release of N-P-K\n🌿 **Neem Cake**: 250 kg/ha — also acts as pest repellent\n🐟 **Fish Amino Acid**: Foliar spray at 5 ml/L — promotes growth\n🍌 **Banana Stem Juice**: Rich in potassium — excellent for fruiting crops\n\n💡 **Tip**: Combine Jeevamrutha (cow dung + jaggery + besan fermented) as soil drench monthly.",
  "urea": "**When to Apply Urea for Wheat:**\n\n📅 Split application is most efficient:\n1. **Basal dose**: 1/3 at sowing (40 kg/ha)\n2. **First top dress**: 1/3 at CRI stage (21 days, Crown Root Initiation)\n3. **Second top dress**: 1/3 at tillering stage (45 days)\n\n⚠️ **Important**:\n• Never apply urea in standing water\n• Apply in moist soil, preferably evening\n• Total recommended: 120 kg N/ha (≈ 260 kg Urea/ha)\n• Use neem-coated urea for 10% better efficiency",
  "kcc": "**How to Get Kisan Credit Card (KCC):**\n\n1. 🏦 Visit nearest bank branch (SBI, PNB, any cooperative bank)\n2. 📄 Documents needed:\n   • Aadhaar card\n   • Land ownership documents (Patta/Chitta)\n   • Passport-size photos\n   • Latest crop details\n3. 📝 Fill KCC application form\n4. ✅ Bank inspects land and sanctions within 15 days\n\n💰 **Benefits**:\n• Loan up to ₹3,00,000 at 4% interest (with interest subvention)\n• ATM-enabled RuPay card\n• Crop insurance cover under PMFBY\n• No processing fee for loans under ₹3L",
  "leaf curl": "**Leaf Curl Disease in Chilli — Prevention & Control:**\n\n🦟 **Cause**: Whitefly-transmitted Gemini virus\n\n🛡️ **Prevention**:\n1. Use virus-resistant varieties (Pusa Jwala, Arka Lohit)\n2. Install yellow sticky traps (25/acre)\n3. Apply neem oil 5% at 3 ml/L every 15 days\n4. Intercrop with marigold (trap crop for whiteflies)\n\n🧪 **Chemical Control**:\n• Spray Imidacloprid 17.8 SL at 0.5 ml/L\n• Alternate with Thiamethoxam 25 WG at 0.5 g/L\n• Spray in evening hours for best results",
};

function generateReply(message: string): string {
  const lower = message.toLowerCase();

  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lower.includes(key)) return value;
  }

  // Generic helpful responses based on keywords
  if (lower.includes("soil") || lower.includes("mண்")) {
    return "I can help with soil-related queries! Please specify:\n• Your soil type (alluvial, black, red, laterite, sandy, clay, loamy)\n• What you'd like to know (crop recommendations, fertilizer plan, pH correction)\n\nYou can also use our **Soil Health Analysis** tool in the dashboard for a detailed 0–100 score with personalized fertilizer recommendations.";
  }

  if (lower.includes("pest") || lower.includes("disease") || lower.includes("insect")) {
    return "For pest and disease management, I need to know:\n1. 🌾 Which crop is affected?\n2. 🔍 What symptoms do you see? (leaf spots, wilting, holes, yellowing)\n3. 📍 Which part of plant? (leaf, stem, root, fruit)\n\nMeanwhile, some general IPM tips:\n• Use yellow/blue sticky traps for monitoring\n• Apply neem oil 5% as preventive spray\n• Maintain field sanitation\n• Encourage natural enemies (lady beetles, spiders)";
  }

  if (lower.includes("scheme") || lower.includes("government") || lower.includes("subsidy")) {
    return "Key government schemes for Indian farmers:\n\n1. **PM-KISAN**: ₹6,000/year direct transfer\n2. **PMFBY**: Crop insurance at 1.5-5% premium\n3. **KCC**: Loans at 4% interest\n4. **Soil Health Card**: Free soil testing\n5. **PM Kisan MaanDhan**: ₹3,000/month pension after 60\n6. **e-NAM**: Online mandi for better prices\n7. **PMKSY**: 90% subsidy on drip irrigation\n\nAsk about any specific scheme for detailed eligibility and application process!";
  }

  if (lower.includes("weather") || lower.includes("rain") || lower.includes("forecast")) {
    return "For real-time weather updates, please check our **Weather** section in the dashboard. It provides:\n• Current temperature, humidity, and wind\n• 7-day forecast\n• Rain predictions\n• Farming-specific weather advisories\n\n🌧️ **General monsoon tips**:\n• Prepare drainage channels before rain\n• Apply fertilizers before expected rain\n• Avoid spraying pesticides if rain is expected within 4 hours";
  }

  if (lower.includes("price") || lower.includes("market") || lower.includes("mandi")) {
    return "For current market prices, you can:\n1. Check **e-NAM** (enam.gov.in) for real-time mandi prices\n2. Use our **Sell Produce** section to list your harvest\n3. Compare prices across nearby mandis\n\n💡 **Tips for better prices**:\n• Grade and clean produce before selling\n• Sell in bulk to reduce transport costs\n• Check multiple buyers before finalizing\n• Store in government warehouses if prices are low";
  }

  return "Thank you for your question! Here's what I can help you with:\n\n🌾 **Crop Planning**: Best crops for your soil and season\n🧪 **Soil Health**: Fertilizer recommendations based on soil test\n🐛 **Pest Management**: Identification and control measures\n📋 **Government Schemes**: Eligibility and application process\n🌤️ **Weather**: Forecasts and farming advisories\n💰 **Market Prices**: Current mandi rates and selling tips\n\nPlease ask a specific question and I'll provide detailed guidance!";
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const reply = generateReply(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    );
  }
}

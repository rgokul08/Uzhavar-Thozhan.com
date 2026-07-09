import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPTS: Record<string, string> = {
  en: "You are the Uzhavar Thozhan AI assistant, an expert in Indian agriculture: crop advice, plant disease, government schemes, market prices, weather-driven farm decisions, insurance and loans. Answer clearly and practically for a smallholder farmer. Keep answers concise unless asked for detail.",
  ta: "நீங்கள் உழவர் தோழன் AI உதவியாளர். இந்திய விவசாயம், பயிர் ஆலோசனை, தாவர நோய், அரசு திட்டங்கள், சந்தை விலைகள், காலநிலை சார்ந்த முடிவுகள், காப்பீடு மற்றும் கடன் குறித்து தெளிவாகவும் நடைமுறைக்கு உகந்ததாகவும் தமிழில் பதிலளியுங்கள்.",
  hi: "आप उझावर थोझन AI सहायक हैं, जो भारतीय कृषि के विशेषज्ञ हैं: फसल सलाह, पौध रोग, सरकारी योजनाएं, बाजार भाव, मौसम आधारित निर्णय, बीमा और ऋण। छोटे किसान के लिए स्पष्ट और व्यावहारिक हिंदी में उत्तर दें।",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI assistant isn't configured yet. Add OPENAI_API_KEY in your environment variables to enable it." },
      { status: 501 }
    );
  }

  const { messages, language = "en" } = await req.json();
  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[language] ?? SYSTEM_PROMPTS.en },
        ...messages,
      ],
      temperature: 0.4,
    });
    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "The assistant couldn't respond. Try again." }, { status: 500 });
  }
}

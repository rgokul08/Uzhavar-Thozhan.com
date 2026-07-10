import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { soilReports } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nitrogen, phosphorus, potassium, ph, organicCarbon, healthScore, advice } = body;

    await db.insert(soilReports).values({
      nitrogen: nitrogen?.toString(),
      phosphorus: phosphorus?.toString(),
      potassium: potassium?.toString(),
      ph: ph?.toString(),
      organicCarbon: organicCarbon?.toString(),
      healthScore,
      advice,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Soil report error:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: replace this rule-of-thumb matcher with a proper agronomy model
// (soil type + N-P-K + pH + season + rainfall zone), or call out to an
// external agri-advisory API if the state department provides one.
export async function POST(req: NextRequest) {
  const { soilType, ph, season } = await req.json();

  const crops = await prisma.crop.findMany({
    where: {
      idealSoilTypes: { has: soilType },
      ...(season ? { idealSeason: season } : {})
    }
  });

  return NextResponse.json({ crops, note: ph ? `Matched for soil pH ${ph}` : undefined });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: handle photo/video evidence upload (STORAGE_* env vars) and route
// claims to a real adjudication workflow / insurer API for payout.
export async function POST(req: NextRequest) {
  const { farmerId, insuranceId, reason, description, photoUrls } = await req.json();
  const claim = await prisma.insuranceClaim.create({
    data: { farmerId, insuranceId, reason, description, photoUrls: photoUrls || [] }
  });
  return NextResponse.json({ claim });
}

export async function GET(req: NextRequest) {
  const farmerId = req.nextUrl.searchParams.get("farmerId");
  if (!farmerId) return NextResponse.json({ claims: [] });
  const claims = await prisma.insuranceClaim.findMany({ where: { farmerId } });
  return NextResponse.json({ claims });
}

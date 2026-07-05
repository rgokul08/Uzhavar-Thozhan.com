import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: integrate with a real crop insurance scheme (e.g. PMFBY) or a
// private insurer's API for live premium quotes and policy issuance.
export async function GET() {
  const plans = await prisma.insurancePlan.findMany();
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const { farmerId, planId, sumInsured, premiumPaid, season } = await req.json();
  const insurance = await prisma.insurance.create({
    data: { farmerId, planId, sumInsured, premiumPaid, season }
  });
  return NextResponse.json({ insurance });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: connect to real lending partners (NABARD / nationalized banks /
// cooperative banks) for eligibility checks and disbursement status.
export async function GET() {
  const schemes = await prisma.loanScheme.findMany();
  return NextResponse.json({ schemes });
}

export async function POST(req: NextRequest) {
  const { farmerId, schemeId, amountRequested } = await req.json();
  const loan = await prisma.loan.create({ data: { farmerId, schemeId, amountRequested } });
  return NextResponse.json({ loan });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const equipment = await prisma.equipment.findMany({ where: { available: true } });
  return NextResponse.json({ equipment });
}

export async function POST(req: NextRequest) {
  const { farmerId, equipmentId, startDate, endDate, totalCost } = await req.json();
  const booking = await prisma.equipmentBooking.create({
    data: { farmerId, equipmentId, startDate: new Date(startDate), endDate: new Date(endDate), totalCost }
  });
  return NextResponse.json({ booking });
}

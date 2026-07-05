import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const listings = await prisma.marketListing.findMany({
    where: { status: "available" },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const { farmerId, produceName, quantityKg, pricePerKg, harvestDate, buyerType } = await req.json();
  const listing = await prisma.marketListing.create({
    data: {
      farmerId,
      produceName,
      quantityKg,
      pricePerKg,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      buyerType
    }
  });
  return NextResponse.json({ listing });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { produceListings } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const listings = await db.select().from(produceListings).orderBy(desc(produceListings.createdAt)).limit(50);
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Produce listing error:", error);
    return NextResponse.json({ listings: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropName, quantity, unit, pricePerUnit, description } = body;

    const [listing] = await db.insert(produceListings).values({
      cropName,
      quantity: quantity?.toString(),
      unit,
      pricePerUnit: pricePerUnit?.toString(),
      description: description || null,
    }).returning();

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

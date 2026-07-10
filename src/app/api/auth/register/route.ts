import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { farmerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, password, village, district, state, landSize, soilType } = body;

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Name, phone and password are required" }, { status: 400 });
    }

    // Check if phone already exists
    const existing = await db.select().from(farmerProfiles).where(eq(farmerProfiles.phone, phone));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [farmer] = await db
      .insert(farmerProfiles)
      .values({
        name,
        phone,
        email: email || null,
        password: hashedPassword,
        village: village || null,
        district: district || null,
        state: state || null,
        landSize: landSize || null,
        soilType: soilType || null,
      })
      .returning({ id: farmerProfiles.id, name: farmerProfiles.name });

    return NextResponse.json({ farmerId: farmer.id, name: farmer.name });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

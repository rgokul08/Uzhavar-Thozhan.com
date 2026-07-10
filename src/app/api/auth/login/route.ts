import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { farmerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone and password are required" }, { status: 400 });
    }

    const [farmer] = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.phone, phone));

    if (!farmer) {
      return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, farmer.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 });
    }

    return NextResponse.json({
      farmerId: farmer.id,
      name: farmer.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

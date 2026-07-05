import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ phone: z.string().min(8), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid phone number and password" }, { status: 400 });
  }

  const farmer = await prisma.farmer.findUnique({ where: { phone: parsed.data.phone } });
  if (!farmer || !(await verifyPassword(parsed.data.password, farmer.passwordHash))) {
    return NextResponse.json({ error: "Incorrect phone number or password" }, { status: 401 });
  }

  const token = signSession(farmer.id);
  const res = NextResponse.json({ id: farmer.id, name: farmer.name });
  res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}

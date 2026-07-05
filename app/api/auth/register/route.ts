import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  password: z.string().min(6),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const existing = await prisma.farmer.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const farmer = await prisma.farmer.create({
    data: { ...parsed.data, passwordHash }
  });

  const token = signSession(farmer.id);
  const res = NextResponse.json({ id: farmer.id, name: farmer.name });
  res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: integrate a video SDK (Agora / Twilio Video / 100ms) using
// VIDEO_SDK_APP_ID / VIDEO_SDK_APP_SECRET to generate a real room token
// on booking, instead of the placeholder roomId below.
export async function GET() {
  const experts = await prisma.expertDoctor.findMany();
  return NextResponse.json({ experts });
}

export async function POST(req: NextRequest) {
  const { farmerId, expertId, scheduledAt, durationMin } = await req.json();
  const consultation = await prisma.consultation.create({
    data: {
      farmerId,
      expertId,
      scheduledAt: new Date(scheduledAt),
      durationMin: durationMin || 15,
      roomId: `room-${Date.now()}`
    }
  });
  return NextResponse.json({ consultation });
}

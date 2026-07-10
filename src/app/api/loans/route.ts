import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { loanApplications } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const applications = await db.select().from(loanApplications).orderBy(desc(loanApplications.createdAt)).limit(50);
    return NextResponse.json({ applications });
  } catch {
    return NextResponse.json({ applications: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { loanType, amount, purpose } = await req.json();
    const [application] = await db.insert(loanApplications).values({
      loanType,
      amount: amount?.toString(),
      purpose,
    }).returning();
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

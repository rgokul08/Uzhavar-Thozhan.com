import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: some states publish scheme feeds/APIs (e.g. state agri department
// portals); merge those with the locally-curated GovtScheme table so this
// stays current without a manual update for every policy change.
export async function GET() {
  const schemes = await prisma.govtScheme.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json({ schemes });
}

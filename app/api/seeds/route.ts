import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Covers both feature 09 (pesticides/medicines) and feature 13 (seeds) —
// both are "Product" records distinguished by category.
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" }
  });
  return NextResponse.json({ products });
}

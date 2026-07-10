import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { communityPosts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const posts = await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt)).limit(50);
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, category } = await req.json();
    const [post] = await db.insert(communityPosts).values({
      title,
      content,
      category,
    }).returning();
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Community post error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

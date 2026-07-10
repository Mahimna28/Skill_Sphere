import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["superadmin", "admin", "teacher", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized. Insufficient permissions to create a blog post." }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, category, coverImage, tags, readTime } = body;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Ensure slug is unique
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    let finalSlug = slug;
    if (existingPost) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        category,
        coverImage,
        tags: tags || "",
        readTime: parseInt(readTime) || 5,
        publishedAt: new Date(),
        authorId: decoded.id
      }
    });

    return NextResponse.json({ message: "Blog post published successfully", post }, { status: 201 });

  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ message: error.message || "Failed to create blog post" }, { status: 500 });
  }
}

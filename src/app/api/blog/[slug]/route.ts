import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            bio: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ message: "Server error", post: null }, { status: 500 });
  }
}

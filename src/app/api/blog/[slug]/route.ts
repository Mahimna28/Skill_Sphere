import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["superadmin", "admin", "teacher", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== decoded.id && decoded.role !== "superadmin" && decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, excerpt, content, category, coverImage, tags, readTime } = body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        category,
        coverImage,
        tags: tags || "",
        readTime: parseInt(readTime) || 5,
      }
    });

    return NextResponse.json({ message: "Post updated", post: updated }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["superadmin", "admin", "teacher", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== decoded.id && decoded.role !== "superadmin" && decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to delete" }, { status: 500 });
  }
}

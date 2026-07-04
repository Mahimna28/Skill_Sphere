import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }
    if (featured === "true") {
      whereClause.featured = true;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        readTime: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        publishedAt: "desc"
      }
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ message: "Server error", posts: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded || (decoded.role !== "superadmin" && decoded.role !== "teacher")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, excerpt, content, coverImage, category, tags, readTime, featured } = body;
    
    if (!title || !content || !category) {
      return NextResponse.json({ message: "Missing required fields (title, content, category)" }, { status: 400 });
    }
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists
    const existing = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    
    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || null,
        category,
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        readTime: readTime ? parseInt(readTime) : 5,
        featured: featured || false,
        publishedAt: new Date(),
        authorId: decoded.id
      }
    });
    
    return NextResponse.json({ message: "Blog post created successfully", post }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

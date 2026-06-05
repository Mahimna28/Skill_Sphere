import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: Fetch all questions
export async function GET(req: Request) {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: { select: { name: true, image: true, username: true, role: true } },
        _count: { select: { answers: true } },
        answers: {
          include: {
            author: { select: { name: true, image: true, username: true, role: true } }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Create a new question
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        authorId: decoded.id
      }
    });

    return NextResponse.json({ message: "Question posted!", question });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a question
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("id");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !questionId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Only author or admin can delete
    if (question.authorId !== decoded.id && !["superadmin", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id: questionId } });

    return NextResponse.json({ message: "Question deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

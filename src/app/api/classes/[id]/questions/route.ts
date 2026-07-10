import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// GET /api/classes/[id]/questions
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const questions = await prisma.classQuestion.findMany({
      where: { courseId },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
        replies: { include: { author: { select: { id: true, name: true, image: true, role: true } } }, orderBy: { createdAt: "asc" } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/classes/[id]/questions — teacher posts a discussion question
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const courseIdForAccess = (await params).id;
    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { question, topicId, subjectId } = await req.json();
    if (!question) return NextResponse.json({ message: "Question is required" }, { status: 400 });

    const q = await prisma.classQuestion.create({
      data: { question, courseId, authorId: decoded.id, topicId: topicId || null, subjectId: subjectId || null }
    });

    return NextResponse.json({ question: q });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

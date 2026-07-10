import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// GET /api/classes/[id]/materials
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const materials = await prisma.classMaterial.findMany({
      where: { courseId },
      include: { author: { select: { name: true, image: true } }, topic: { select: { title: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ materials });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/classes/[id]/materials
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

    const { title, description, fileUrl, linkUrl, topicId, subjectId } = await req.json();
    if (!title) return NextResponse.json({ message: "Title is required" }, { status: 400 });

    const material = await prisma.classMaterial.create({
      data: { title, description, fileUrl, linkUrl, topicId: topicId || null, subjectId: subjectId || null, courseId, authorId: decoded.id }
    });

    return NextResponse.json({ material });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

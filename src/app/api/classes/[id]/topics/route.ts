import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// GET /api/classes/[id]/topics
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const topics = await prisma.classTopic.findMany({
      where: { courseId },
      include: {
        assignments: { orderBy: { createdAt: "asc" } },
        materials: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { order: "asc" }
    });

    return NextResponse.json({ topics });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/classes/[id]/topics — teacher creates a topic
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const canEdit = await checkClassAccess(courseId, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { title, subjectId } = await req.json();
    if (!title) return NextResponse.json({ message: "Title is required" }, { status: 400 });

    const count = await prisma.classTopic.count({ where: { courseId } });
    const topic = await prisma.classTopic.create({ data: { title, courseId, order: count, subjectId: subjectId || null } });

    return NextResponse.json({ topic });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

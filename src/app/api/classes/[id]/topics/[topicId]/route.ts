import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// PATCH /api/classes/[id]/topics/[topicId]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; topicId: string }> }) {
  try {
    const { topicId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;
    const canEdit = await checkClassAccess(courseId, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { title } = await req.json();
    const topic = await prisma.classTopic.update({ where: { id: topicId }, data: { title } });

    return NextResponse.json({ topic });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/classes/[id]/topics/[topicId]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; topicId: string }> }) {
  try {
    const { topicId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: courseId } = await params;
    const canEdit = await checkClassAccess(courseId, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await prisma.classTopic.delete({ where: { id: topicId } });
    return NextResponse.json({ message: "Topic deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

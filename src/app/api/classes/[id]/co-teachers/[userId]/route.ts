import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const { id: courseId, userId: coTeacherId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    // Only the primary teacher can remove a co-teacher, OR a co-teacher can remove themselves
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true }
    });

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isPrimaryTeacher = course?.teacherId === decoded.id;
    const isSelfRemoval = coTeacherId === decoded.id;

    if (!isPrimaryTeacher && !isSelfRemoval) {
      return NextResponse.json({ message: "Forbidden: Only the primary teacher can remove other co-teachers." }, { status: 403 });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        coTeachers: { disconnect: { id: coTeacherId } }
      }
    });

    return NextResponse.json({ message: "Co-teacher removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

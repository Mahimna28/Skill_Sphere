import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// GET /api/classes/[id]/submissions — teacher gets all submissions
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const courseIdForAccess = (await params).id;
    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Get all assignments with all submissions + students enrolled in the class
    const [assignments, enrollments] = await Promise.all([
      prisma.assignment.findMany({
        where: { courseId },
        include: {
          submissions: {
            include: { student: { select: { id: true, name: true, email: true, image: true } } }
          }
        },
        orderBy: { createdAt: "asc" }
      }),
      prisma.enrollment.findMany({
        where: { courseId },
        include: { user: { select: { id: true, name: true, email: true, image: true } } }
      })
    ]);

    return NextResponse.json({ assignments, students: enrollments.map(e => e.user) });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

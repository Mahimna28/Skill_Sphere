import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// PATCH /api/classes/[id]/assignments/[aId]/return — teacher grades and returns
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; aId: string }> }) {
  try {
    const { aId: assignmentId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const courseIdForAccess = (await params).id;
    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { studentId, grade, feedback } = await req.json();
    if (!studentId || grade === undefined) return NextResponse.json({ message: "studentId and grade are required" }, { status: 400 });

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });

    const submission = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      update: {
        grade,
        feedback: feedback || null,
        status: "graded",
        returnedAt: new Date()
      },
      create: {
        assignmentId,
        studentId,
        grade,
        feedback: feedback || null,
        status: "graded",
        returnedAt: new Date()
      }
    });

    // Notify the student
    await prisma.notification.create({
      data: {
        userId: studentId,
        type: "assignment_graded",
        title: "Assignment Graded",
        body: `Your submission for "${assignment.title}" has been graded.`,
        linkUrl: `/dashboard/student/courses/${assignment.courseId}`
      }
    });

    return NextResponse.json({ submission });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

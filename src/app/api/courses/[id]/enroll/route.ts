import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let targetUserId = decoded.id;

    if (decoded.role === "teacher") {
      // Teacher manual enrollment mode
      const body = await req.json().catch(() => ({}));
      const { email } = body;

      if (!email) return NextResponse.json({ message: "Email required for manual enrollment" }, { status: 400 });

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || course.teacherId !== decoded.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

      // --- Institution checks ---
      const teacher = await prisma.user.findUnique({ where: { id: decoded.id }, select: { institutionId: true } });
      if (!teacher?.institutionId) {
        return NextResponse.json({ message: "You must belong to an institution before enrolling students." }, { status: 400 });
      }

      const student = await prisma.user.findUnique({ where: { email }, select: { id: true, institutionId: true } });
      if (!student) return NextResponse.json({ message: "No student found with this email. They must register first." }, { status: 404 });

      if (student.institutionId && student.institutionId !== teacher.institutionId) {
        return NextResponse.json({ message: "This student already belongs to a different institution and cannot be added to your class." }, { status: 400 });
      }

      // Auto-assign student to teacher's institution if they have none
      if (!student.institutionId) {
        await prisma.user.update({
          where: { id: student.id },
          data: { institutionId: teacher.institutionId },
        });
      }

      targetUserId = student.id;
    } else if (decoded.role !== "student") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Perform enrollment
    await prisma.enrollment.create({
      data: {
        userId: targetUserId,
        courseId,
      }
    });

    // Check if they ever enrolled before to prevent point farming
    const history = await prisma.enrollmentHistory.findUnique({
      where: { userId_courseId: { userId: targetUserId, courseId } }
    });

    if (!history) {
      // Record history and award points
      await prisma.enrollmentHistory.create({
        data: { userId: targetUserId, courseId }
      });

      await prisma.user.update({
        where: { id: targetUserId },
        data: { points: { increment: 50 } }
      });
    }

    return NextResponse.json({ message: "Enrollment successful!" });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ message: "Already enrolled" }, { status: 400 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (decoded.role === "teacher") {
      // Teacher un-enrolling a student
      if (!enrollmentId) return NextResponse.json({ message: "Enrollment ID required" }, { status: 400 });
      
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || course.teacherId !== decoded.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

      await prisma.enrollment.delete({
        where: { id: enrollmentId }
      });
      return NextResponse.json({ message: "Student unenrolled" });
    } else if (decoded.role === "student") {
      // Student leaving a course
      // We need to delete the enrollment record mapping this student to this course
      await prisma.enrollment.deleteMany({
        where: { userId: decoded.id, courseId }
      });
      return NextResponse.json({ message: "Successfully left the course" });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

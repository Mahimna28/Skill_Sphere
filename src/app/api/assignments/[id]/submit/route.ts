import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: assignmentId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: { include: { enrollments: { where: { userId: decoded.id } } } } }
    });

    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    // Verify student is enrolled in the course
    if (assignment.course.enrollments.length === 0) {
      return NextResponse.json({ message: "You are not enrolled in this course" }, { status: 403 });
    }

    // Check if already submitted — allow update (re-submit)
    const existing = await prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId: decoded.id } }
    });

    // If already graded, don't allow re-submission
    if (existing?.status === "graded") {
      return NextResponse.json({ message: "This assignment has already been graded and cannot be re-submitted." }, { status: 400 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    let fileUrl: string | null = null;

    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      // Upload the file via the /api/upload endpoint logic
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/upload`, {
        method: "POST",
        body: uploadFormData,
        headers: {
          cookie: `token=${token}`
        }
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
      }
    }

    if (!text?.trim() && !fileUrl) {
      return NextResponse.json({ message: "Please provide submission text or upload a file" }, { status: 400 });
    }

    const submission = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId: decoded.id } },
      update: {
        content: text?.trim() || null,
        fileUrl: fileUrl || null,
        status: "turned_in",
        turnedInAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: decoded.id,
        content: text?.trim() || null,
        fileUrl: fileUrl || null,
        status: "turned_in",
        turnedInAt: new Date(),
      }
    });

    // Notify teacher
    await prisma.notification.create({
      data: {
        userId: assignment.course.teacherId,
        type: "assignment_submitted",
        title: "New Submission",
        body: `A student submitted "${assignment.title}".`,
        linkUrl: `/dashboard/teacher/courses/${assignment.courseId}`
      }
    });

    return NextResponse.json({ message: "Assignment submitted successfully!", submission });
  } catch (error) {
    console.error("Assignment submit error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: assignmentId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId: decoded.id } }
    });

    return NextResponse.json({ submission: submission || null });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

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

    if (!decoded || decoded.role !== "student") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });

    // Check if a request already exists
    const existing = await prisma.courseLeaveRequest.findUnique({
      where: { userId_courseId: { userId: decoded.id, courseId } }
    });

    if (existing) {
      if (existing.status === "pending") return NextResponse.json({ message: "Request already pending" }, { status: 400 });
      // If rejected, allow them to request again? Let's just update to pending.
      await prisma.courseLeaveRequest.update({
        where: { id: existing.id },
        data: { status: "pending" }
      });
      return NextResponse.json({ message: "Leave request submitted" });
    }

    await prisma.courseLeaveRequest.create({
      data: {
        userId: decoded.id,
        courseId,
        status: "pending"
      }
    });

    return NextResponse.json({ message: "Leave request submitted" });
  } catch (error) {
    console.error("Leave request POST error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || (course.teacherId !== decoded.id && decoded.role !== "institute_admin" && decoded.role !== "superadmin")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { requestId, action } = await req.json(); // action = "approve" or "reject"
    if (!requestId || !action) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    if (action === "approve") {
      const leaveRequest = await prisma.courseLeaveRequest.update({
        where: { id: requestId },
        data: { status: "approved" }
      });

      // Remove the student's enrollment
      await prisma.enrollment.deleteMany({
        where: { userId: leaveRequest.userId, courseId: courseId }
      });

      // Optionally, delete the leave request to clean up
      await prisma.courseLeaveRequest.delete({ where: { id: requestId } });

      return NextResponse.json({ message: "Request approved and student removed" });
    } else if (action === "reject") {
      await prisma.courseLeaveRequest.update({
        where: { id: requestId },
        data: { status: "rejected" }
      });
      
      // Optionally just delete it so it disappears
      await prisma.courseLeaveRequest.delete({ where: { id: requestId } });

      return NextResponse.json({ message: "Request rejected" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Leave request PATCH error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Only students can enroll in courses." }, { status: 403 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ message: "Course not found." }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.id,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already enrolled in this course." }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: decoded.id,
        courseId,
        status: "active",
        progress: 0,
      },
    });

    await prisma.user.update({
      where: { id: decoded.id },
      data: { points: { increment: 50 } }
    });

    return NextResponse.json({ success: true, message: "Enrolled! +50 points awarded. 🎉", enrollment }, { status: 201 });
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: decoded.id },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            teacher: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

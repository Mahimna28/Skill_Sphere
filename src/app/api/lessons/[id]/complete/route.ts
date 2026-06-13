import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: lessonId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;

    // Check if the lesson is already completed by this user
    const existingCompletion = await prisma.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (existingCompletion) {
      return NextResponse.json({ message: "Lesson already completed" }, { status: 400 });
    }

    // Mark as completed
    await prisma.lessonCompletion.create({
      data: {
        userId,
        lessonId,
      },
    });

    // Award +20 points for completing a lesson
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 20 } },
    });

    // Check if the whole course is completed
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true, course: { select: { title: true } } } } }
    });

    if (lesson) {
      const courseId = lesson.module.courseId;
      const courseTitle = lesson.module.course.title;
      
      const totalCourseLessons = await prisma.lesson.count({
        where: { module: { courseId } }
      });
      
      const completedCourseLessons = await prisma.lessonCompletion.count({
        where: { userId, lesson: { module: { courseId } } }
      });

      if (totalCourseLessons > 0 && completedCourseLessons === totalCourseLessons) {
        // Course completed! Award Certificate if not already awarded
        const existingCert = await prisma.certificate.findFirst({
          where: { userId, title: `Certificate of Completion: ${courseTitle}` }
        });

        if (!existingCert) {
          const newCert = await prisma.certificate.create({
            data: {
              title: `Certificate of Completion: ${courseTitle}`,
              userId,
              url: ""
            }
          });
          return NextResponse.json({ message: "Lesson completed! Course finished! Certificate Awarded!", pointsEarned: 20, courseCompleted: true, certificateId: newCert.id });
        } else {
          return NextResponse.json({ message: "Lesson completed! Course finished!", pointsEarned: 20, courseCompleted: true, certificateId: existingCert.id });
        }
      }
    }

    return NextResponse.json({ message: "Lesson completed! +20 points", pointsEarned: 20 });
  } catch (error: any) {
    console.error("Lesson completion error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

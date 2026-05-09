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

    return NextResponse.json({ message: "Lesson completed! +20 points", pointsEarned: 20 });
  } catch (error: any) {
    console.error("Lesson completion error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

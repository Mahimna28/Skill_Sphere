import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Fetch assignments with due dates
    const assignments = await prisma.assignment.findMany({
      where: { courseId, dueDate: { not: undefined } },
      select: { id: true, title: true, dueDate: true }
    });

    // Fetch quizzes with due dates
    const topics = await prisma.classTopic.findMany({
      where: { courseId },
      select: { quizzes: { select: { id: true, title: true, dueDate: true } } }
    });
    const quizzes = topics.flatMap(t => t.quizzes).filter(q => q.dueDate);

    // Fetch custom class events
    const events = await prisma.classEvent.findMany({
      where: { courseId },
      select: { id: true, title: true, startTime: true, endTime: true, location: true }
    });

    return NextResponse.json({ assignments, quizzes, events });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

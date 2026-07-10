import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const canEdit = await checkClassAccess(courseId, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { title, description, dueDate, timeLimitMinutes, topicId, subjectId, questions } = await req.json();
    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ message: "Title and questions are required" }, { status: 400 });
    }

    const quiz = await prisma.classQuiz.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes) : null,
        topicId: topicId || null,
        subjectId: subjectId || null,
        questions: {
          create: questions.map((q: any, i: number) => ({
            questionText: q.questionText,
            type: q.type || "multiple_choice",
            points: q.points || 1,
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            order: i
          }))
        }
      }
    });

    return NextResponse.json({ message: "Quiz created", quiz });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

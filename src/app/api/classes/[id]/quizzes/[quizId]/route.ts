import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string; quizId: string }> }) {
  try {
    const { id: courseId, quizId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const quiz = await prisma.classQuiz.findUnique({
      where: { id: quizId },
      include: {
        questions: { orderBy: { order: "asc" } }
      }
    });

    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    // Check if the user has already submitted
    const existingSubmission = await prisma.quizSubmission.findUnique({
      where: { quizId_userId: { quizId, userId: decoded.id } },
      include: { answers: true }
    });

    return NextResponse.json({ quiz, submission: existingSubmission });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; quizId: string }> }) {
  try {
    const { id: courseId, quizId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { answers } = await req.json(); // { [questionId]: "user answer" }

    const quiz = await prisma.classQuiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    // Check if already submitted
    const existing = await prisma.quizSubmission.findUnique({
      where: { quizId_userId: { quizId, userId: decoded.id } }
    });
    if (existing) return NextResponse.json({ message: "Already submitted" }, { status: 400 });

    let totalScore = 0;
    const answerRecords = quiz.questions.map(q => {
      const userAnswer = answers[q.id] || "";
      const isCorrect = q.correctAnswer ? userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : null;
      const pointsAwarded = isCorrect ? q.points : 0;
      if (isCorrect) totalScore += pointsAwarded;

      return {
        questionId: q.id,
        answerText: userAnswer,
        isCorrect,
        pointsAwarded
      };
    });

    const submission = await prisma.quizSubmission.create({
      data: {
        quizId,
        userId: decoded.id,
        status: "graded",
        score: totalScore,
        answers: {
          create: answerRecords
        }
      }
    });

    return NextResponse.json({ message: "Quiz submitted successfully", score: totalScore });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

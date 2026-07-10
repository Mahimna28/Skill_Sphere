import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST /api/classes/[id]/questions/[qId]/replies
export async function POST(req: Request, { params }: { params: Promise<{ id: string; qId: string }> }) {
  try {
    const { qId: questionId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { content } = await req.json();
    if (!content) return NextResponse.json({ message: "Content is required" }, { status: 400 });

    const reply = await prisma.classQuestionReply.create({
      data: { content, questionId, authorId: decoded.id },
      include: { author: { select: { id: true, name: true, image: true, role: true } } }
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

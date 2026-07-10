import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET /api/classes/[id]/stream — returns unified feed of all activity
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const [announcements, assignments, materials, questions] = await Promise.all([
      prisma.announcement.findMany({
        where: { courseId },
        include: { author: { select: { id: true, name: true, image: true, role: true } } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.assignment.findMany({
        where: { courseId },
        include: {
          _count: { select: { submissions: true } },
          topic: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.classMaterial.findMany({
        where: { courseId },
        include: {
          author: { select: { id: true, name: true, image: true } },
          topic: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.classQuestion.findMany({
        where: { courseId },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: { include: { author: { select: { id: true, name: true, image: true } } } }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    // Merge and sort by createdAt
    const stream = [
      ...announcements.map(a => ({ ...a, _type: "announcement" })),
      ...assignments.map(a => ({ ...a, _type: "assignment" })),
      ...materials.map(m => ({ ...m, _type: "material" })),
      ...questions.map(q => ({ ...q, _type: "question" })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ stream });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

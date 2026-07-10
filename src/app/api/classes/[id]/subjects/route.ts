import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) as any : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const subjects = await prisma.classSubject.findMany({
    where: { courseId: id },
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { assignments: true, materials: true, quizzes: true, questions: true }
      }
    }
  });

  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { name, description, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const subject = await prisma.classSubject.create({
    data: {
      name: name.trim(),
      description: description || null,
      color: color || "#C9A96E",
      courseId: id,
    }
  });

  return NextResponse.json(subject, { status: 201 });
}


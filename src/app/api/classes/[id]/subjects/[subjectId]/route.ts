import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? verifyToken(token) as any : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; subjectId: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;

  const { name, description, color } = await req.json();

  const subject = await prisma.classSubject.update({
    where: { id: subjectId },
    data: {
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description }),
      ...(color && { color }),
    }
  });

  return NextResponse.json(subject);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; subjectId: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;

  // Unassign content (set subjectId to null) instead of deleting
  await prisma.$transaction([
    prisma.assignment.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classMaterial.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classQuiz.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classQuestion.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.announcement.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classEvent.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classTopic.updateMany({ where: { subjectId: subjectId }, data: { subjectId: null } }),
    prisma.classSubject.delete({ where: { id: subjectId } }),
  ]);

  return NextResponse.json({ ok: true });
}


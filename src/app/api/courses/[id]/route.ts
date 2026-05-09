import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "teacher") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, subject, thumbnail, isPublic } = await req.json();

    // Verify ownership
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const course = await prisma.course.update({
      where: { id },
      data: { title, description, subject, thumbnail, isPublic },
    });

    return NextResponse.json({ message: "Course updated!", course });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "teacher") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ message: "Course deleted!" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

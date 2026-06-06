import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "teacher") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { studentId, subject, score } = await req.json();

    if (!studentId || !subject || typeof score !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Check if mark already exists for this subject/student to update it, otherwise create
    const existing = await prisma.marks.findFirst({
      where: { studentId, subject }
    });

    if (existing) {
      await prisma.marks.update({
        where: { id: existing.id },
        data: { score }
      });
    } else {
      await prisma.marks.create({
        data: { studentId, subject, score }
      });
    }

    return NextResponse.json({ message: "Mark saved" });
  } catch (error) {
    console.error("Marks error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

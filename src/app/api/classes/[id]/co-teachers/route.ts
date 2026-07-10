import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    // Only the primary teacher can add a co-teacher
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true }
    });

    if (!decoded || course?.teacherId !== decoded.id) {
      return NextResponse.json({ message: "Unauthorized: Only the primary teacher can add co-teachers." }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (userToAdd.id === decoded.id) {
      return NextResponse.json({ message: "You are already the primary teacher" }, { status: 400 });
    }

    // Add co-teacher
    await prisma.course.update({
      where: { id: courseId },
      data: {
        coTeachers: { connect: { id: userToAdd.id } }
      }
    });

    return NextResponse.json({ message: "Co-teacher added successfully", user: userToAdd });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

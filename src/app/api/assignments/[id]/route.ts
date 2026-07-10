import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    if (assignment.course.teacherId !== decoded.id && decoded.role !== "institute_admin" && decoded.role !== "superadmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.assignment.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

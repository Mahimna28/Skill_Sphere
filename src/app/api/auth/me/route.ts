import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, image: true, institutionId: true }
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // --- Backfill: if student has no institution but is in a private class, auto-assign ---
    if (user.role === "student" && !user.institutionId) {
      const enrollmentWithInstitution = await prisma.enrollment.findFirst({
        where: { 
          userId: user.id,
          course: { isPublic: false, teacher: { institutionId: { not: null } } }
        },
        include: { course: { include: { teacher: true } } }
      });

      if (enrollmentWithInstitution?.course.teacher.institutionId) {
        const institutionId = enrollmentWithInstitution.course.teacher.institutionId;
        await prisma.user.update({
          where: { id: user.id },
          data: { institutionId }
        });
        user.institutionId = institutionId;
      }
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

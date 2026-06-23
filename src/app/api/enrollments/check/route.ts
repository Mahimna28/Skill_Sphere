import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ enrolled: false });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ enrolled: false });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ enrolled: false });
    }

    return NextResponse.json({
      enrolled: true,
      progress: enrollment.progress,
      status: enrollment.status,
    });
  } catch (error) {
    console.error("Check enrollment error:", error);
    return NextResponse.json({ enrolled: false });
  }
}

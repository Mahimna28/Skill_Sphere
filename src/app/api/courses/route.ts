import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded?.id || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, details, subject, thumbnail, isPublic } = await req.json();

    const course = await prisma.course.create({
      data: {
        title,
        description,
        details: details || null,
        subject,
        thumbnail: thumbnail || null,
        isPublic: isPublic ?? true,
        teacherId: decoded.id,
      },
    });

    return NextResponse.json({ message: "Course created!", course });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

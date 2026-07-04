import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [usersCount, coursesCount, institutionsCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublic: true } }),
      prisma.institution.count()
    ]);

    return NextResponse.json({
      stats: {
        users: usersCount,
        courses: coursesCount,
        institutions: institutionsCount
      }
    });
  } catch (error: any) {
    console.error("Error fetching public stats:", error);
    // Return graceful fallbacks
    return NextResponse.json({
      stats: {
        users: 0,
        courses: 0,
        institutions: 0
      }
    });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "4", 10);

    let courses = await prisma.course.findMany({
      where: {
        isPublic: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        thumbnail: true,
        createdAt: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: "desc"
        }
      },
      take: limit
    });

    // If no enrollments exist in the system at all, fallback to newest courses
    const maxEnrollments = courses.length > 0 ? courses[0]._count.enrollments : 0;
    
    if (maxEnrollments === 0) {
      courses = await prisma.course.findMany({
        where: {
          isPublic: true
        },
        select: {
          id: true,
          title: true,
          description: true,
          subject: true,
          thumbnail: true,
          createdAt: true,
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: limit
      });
    }

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Error fetching popular courses:", error);
    return NextResponse.json({ message: "Server error", courses: [] }, { status: 500 });
  }
}

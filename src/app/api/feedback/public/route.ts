import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Public fetch recent feedback for homepage
export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        type: {
          in: ["suggestion", "positive"] // Just a fallback if types are different, or could fetch all
        }
      },
      include: {
        user: { select: { name: true, role: true, image: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 6
    });

    // If none found with those types, just get any 6
    if (feedbacks.length === 0) {
      const fallbackFeedbacks = await prisma.feedback.findMany({
        include: {
          user: { select: { name: true, role: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 6
      });
      return NextResponse.json({ feedback: fallbackFeedbacks });
    }

    return NextResponse.json({ feedback: feedbacks });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", feedback: [] }, { status: 500 });
  }
}

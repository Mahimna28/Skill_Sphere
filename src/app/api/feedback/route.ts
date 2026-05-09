import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sendFeedbackEmail } from "@/lib/email";

// POST: Submit feedback
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { content, type } = await req.json();
    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        type: type || "suggestion",
        userId: decoded.id
      },
      include: {
        user: { select: { email: true, name: true } }
      }
    });

    // Send email notification
    try {
      await sendFeedbackEmail(
        feedback.user.email,
        feedback.user.name,
        feedback.type,
        feedback.content
      );
      console.log("Feedback email sent successfully to skillspheretest@gmail.com");
    } catch (emailError: any) {
      console.error("CRITICAL: Failed to send feedback email:", emailError.message);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: "Feedback submitted! Thank you.", feedback });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET: Admin fetch all feedback
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ feedbacks });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

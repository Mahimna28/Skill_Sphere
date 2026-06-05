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
      return NextResponse.json({ message: "Unauthorized: Only teachers can request promotion" }, { status: 401 });
    }

    const { reason } = await req.json();

    if (!reason || reason.trim() === "") {
      return NextResponse.json({ message: "A reason is required" }, { status: 400 });
    }

    // Check if already requested
    const existing = await prisma.promotionRequest.findUnique({
      where: { userId: decoded.id }
    });

    if (existing) {
      if (existing.status === "pending") {
         return NextResponse.json({ message: "You already have a pending request." }, { status: 400 });
      } else if (existing.status === "approved") {
         return NextResponse.json({ message: "Your request was already approved." }, { status: 400 });
      } else {
         // If rejected, maybe allow update or block. Let's update it to pending.
         await prisma.promotionRequest.update({
           where: { id: existing.id },
           data: { status: "pending", reason }
         });
         return NextResponse.json({ message: "Request updated and resubmitted successfully." });
      }
    }

    await prisma.promotionRequest.create({
      data: {
        userId: decoded.id,
        reason,
        status: "pending"
      }
    });

    return NextResponse.json({ message: "Promotion request submitted successfully." });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

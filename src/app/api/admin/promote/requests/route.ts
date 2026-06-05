import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { reqId, userId, action } = await req.json();

    if (!reqId || !userId || !action) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (action === "approved") {
      // 1. Update the request status
      await prisma.promotionRequest.update({
        where: { id: reqId },
        data: { status: "approved" }
      });
      // 2. Promote the user to institute_admin
      await prisma.user.update({
        where: { id: userId },
        data: { role: "institute_admin" }
      });
      return NextResponse.json({ message: "Request approved and user promoted" });
    } else if (action === "rejected") {
      // Just update the request status
      await prisma.promotionRequest.update({
        where: { id: reqId },
        data: { status: "rejected" }
      });
      return NextResponse.json({ message: "Request rejected" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

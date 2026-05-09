import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const request = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (action === "approve") {
      // Remove user from institution and department
      await prisma.user.update({
        where: { id: request.userId },
        data: { 
          institutionId: null,
          departmentId: null
        }
      });
      await prisma.leaveRequest.delete({ where: { id } });
    } else {
      await prisma.leaveRequest.delete({ where: { id } });
    }

    return NextResponse.json({ message: "Leave request processed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

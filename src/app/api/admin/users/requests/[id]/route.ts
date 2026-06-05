import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const isAdmin = (role: string) => ["superadmin", "institute_admin"].includes(role);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, departmentId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !isAdmin(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const request = await prisma.joinRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (action === "approve") {
      await prisma.user.update({
        where: { id: request.userId },
        data: {
          institutionId: request.institutionId,
          departmentId: departmentId || null
        }
      });
      await prisma.joinRequest.delete({ where: { id } });
    } else {
      await prisma.joinRequest.delete({ where: { id } });
    }

    return NextResponse.json({ message: "Request processed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

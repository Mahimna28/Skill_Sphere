import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["superadmin", "institute_admin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Feedback deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

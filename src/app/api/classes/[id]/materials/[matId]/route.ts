import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// DELETE /api/classes/[id]/materials/[matId]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; matId: string }> }) {
  try {
    const { matId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const courseIdForAccess = (await params).id;
    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await prisma.classMaterial.delete({ where: { id: matId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

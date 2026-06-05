import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const isSuperadmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;
  return decoded && decoded.role === "superadmin";
};

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await isSuperadmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    await prisma.institution.delete({ where: { id } });
    return NextResponse.json({ message: "Institution deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting institution", error: error.message }, { status: 500 });
  }
}

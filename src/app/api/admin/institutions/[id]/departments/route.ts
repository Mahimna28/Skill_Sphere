import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: institutionId } = await params;
    const { name } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const department = await prisma.department.create({
      data: { name, institutionId },
    });

    return NextResponse.json({ message: "Department created!", department });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deptId = searchParams.get("deptId");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!deptId) return NextResponse.json({ message: "Dept ID required" }, { status: 400 });

    await prisma.department.delete({
      where: { id: deptId },
    });

    return NextResponse.json({ message: "Department deleted!" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
